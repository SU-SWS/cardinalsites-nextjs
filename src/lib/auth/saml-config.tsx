import {SamlConfig} from "passport-saml"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

export const getSamlConfig = async (origin: string): Promise<SamlConfig> => {
  "use cache: remote"
  cacheTag("saml")
  try {
    return {
      entryPoint: process.env.SAML_ENTRY_POINT,
      issuer: process.env.SAML_ENTITY_ID,
      cert: process.env.SAML_IDP_CERT,
      privateKey: process.env.SAML_PRIVATE_KEY,
      decryptionPvk: process.env.SAML_PRIVATE_KEY,
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
