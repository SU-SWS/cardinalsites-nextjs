import nodeVault from "node-vault"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

// Function to fetch certificate from Vault
export const fetchCertFromVault = async (secretPath: string, secretKey: string): Promise<string> => {
  "use cache"
  cacheTag("vault")

  try {
    const vault = nodeVault({endpoint: process.env.VAULT_ENDPOINT})
    await vault.approleLogin({role_id: process.env.VAULT_APPROLE, secret_id: process.env.VAULT_SECRET})
    const response = await vault.read(secretPath)

    if (!response.data?.data || !response.data.data[secretKey]) {
      throw new Error(`Certificate not found at path ${secretPath} with key ${secretKey}`)
    }

    return response.data.data[secretKey] as string
  } catch (error) {
    console.error(`Error fetching certificate from Vault:`, error)
    throw error
  }
}
