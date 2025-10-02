import nodeVault from "node-vault"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

type VaultData = string | Map<string, string>

// Function to fetch secrets from Vault
export const fetchFromVault = async <T extends VaultData = string>(
  secretPath: string,
  secretKey?: string
): Promise<T> => {
  "use cache"
  cacheTag("vault")

  try {
    const vault = nodeVault({endpoint: process.env.VAULT_ENDPOINT})
    await vault.approleLogin({role_id: process.env.VAULT_APPROLE, secret_id: process.env.VAULT_SECRET})
    const response = await vault.read(secretPath)

    if (!secretKey) return new Map(response?.data?.data) as T

    if (!response.data?.data || !response.data.data[secretKey]) {
      throw new Error(`Vault secret not found at path ${secretPath} with key ${secretKey}`)
    }

    return response.data.data[secretKey] as T
  } catch (error) {
    console.error(`Error fetching secret from Vault:`, error)
    throw error
  }
}
