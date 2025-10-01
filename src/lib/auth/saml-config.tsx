import {SamlConfig} from "passport-saml"
import {fetchCertFromVault} from "@lib/utils/vault"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

export const getSamlConfig = async (origin: string): Promise<SamlConfig> => {
  "use cache"
  cacheTag("saml")
  try {
    // Fetch certificates from Vault
    const [idpCert, spPrivateKey] = await Promise.all([
      fetchCertFromVault(process.env.VAULT_SAML_IDP_CERT_PATH as string, process.env.VAULT_SAML_IDP_CERT_KEY as string),
      fetchCertFromVault(
        process.env.VAULT_SAML_SP_PRIVATE_KEY_PATH as string,
        process.env.VAULT_SAML_SP_PRIVATE_KEY_KEY as string
      ),
    ])

    return {
      entryPoint: process.env.SAML_ENTRY_POINT,
      issuer: process.env.SAML_ISSUER,
      cert: idpCert,
      privateKey: spPrivateKey,
      decryptionPvk: spPrivateKey,
      signatureAlgorithm: "sha256" as const,
      digestAlgorithm: "sha256" as const,
      identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
      callbackUrl: `${origin}/api/auth/callback`,
    } as SamlConfig
  } catch (error) {
    console.error("Failed to initialize SAML config with Vault certificates:", error)
    throw error
  }
}
