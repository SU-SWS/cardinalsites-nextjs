const VAULT_ENDPOINT = "https://vault.stanford.edu"

export const vaultEnvVars = async (): Promise<Record<string, string>> => {
  "use cache"
  // @ts-expect-error Process is a global variable.
  const {VAULT_ROLE_ID, VAULT_SECRET_ID, VAULT_PATH} = process.env
  if (!VAULT_ROLE_ID || !VAULT_SECRET_ID || !VAULT_PATH) {
    console.warn("[Vault] No credentials found")
    return {}
  }

  const vaultSecrets: Record<string, string> = {}

  try {
    // Authenticate with AppRole to obtain a client token. Can't use node-vault due when this is executed.
    const loginRes = await fetch(`${VAULT_ENDPOINT}/v1/auth/approle/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({role_id: VAULT_ROLE_ID, secret_id: VAULT_SECRET_ID}),
    })

    if (!loginRes.ok) {
      throw new Error(`Vault AppRole login failed: ${loginRes.status} ${loginRes.statusText}`)
    }

    const {auth} = await loginRes.json()
    const token: string = auth?.client_token

    if (!token) {
      throw new Error("Vault login response did not include a client token")
    }

    // List all secret keys available at the vault path.
    const listRes = await fetch(`${VAULT_ENDPOINT}/v1/${VAULT_PATH}`, {
      headers: {"X-Vault-Token": token},
    })

    if (!listRes.ok) {
      throw new Error(`Vault list secrets failed: ${listRes.status} ${listRes.statusText}`)
    }

    const {
      data: {data: secrets},
    } = await listRes.json()

    if (secrets.length === 0) {
      console.warn("[Vault] No secrets found at path")
      return {}
    }

    // Fetch each secret and add it to the environment, skipping local overrides.
    for (const key of Object.keys(secrets)) {
      // @ts-expect-error Process is a global variable.
      if (process.env[key]) continue
      vaultSecrets[key] = String(secrets[key])
    }

    // eslint-disable-next-line
    console.log("[Vault] Secrets loaded successfully: ", Object.keys(vaultSecrets))
  } catch (error) {
    console.error("[Vault] Failed to load secrets during boot:", error)
  }
  return vaultSecrets
}
