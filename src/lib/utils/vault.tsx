import nodeVault from "node-vault"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

type VaultSecrets = Map<string, string>
type VaultData = string | VaultSecrets

// Function to fetch secrets from Vault
export const fetchFromVault = async <T extends VaultData = VaultSecrets>(
  secretPath: string,
  secretKey?: string
): Promise<T> => {
  "use cache"
  cacheTag("vault")

  try {
    const vault = nodeVault({endpoint: process.env.VAULT_ENDPOINT})
    await vault.approleLogin({role_id: process.env.VAULT_APPROLE, secret_id: process.env.VAULT_SECRET})
    const response = await vault.read(secretPath)
    const secrets = new Map<string, string>(response?.data?.data)
    if (!secretKey) return secrets as T

    if (!secrets.get(secretKey)) {
      throw new Error(`Vault secret not found at path ${secretPath} with key ${secretKey}`)
    }

    return secrets.get(secretKey) as T
  } catch (error) {
    console.error(`Error fetching secret from Vault:`, error)
    throw error
  }
}
