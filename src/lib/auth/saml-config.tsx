import {SamlConfig} from "passport-saml"

const defaultSamlConfig: SamlConfig = {
  entryPoint: process.env.SAML_ENTRY_POINT,
  issuer: process.env.SAML_ISSUER,
  cert: Buffer.from(process.env.SAML_IDP_CERT as string, "base64").toString(),
  privateKey: Buffer.from(process.env.SAML_SP_PRIVATE_KEY as string, "base64").toString(),
  decryptionPvk: Buffer.from(process.env.SAML_SP_PRIVATE_KEY as string, "base64").toString(),
  signatureAlgorithm: "sha256" as const,
  digestAlgorithm: "sha256" as const,
  identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
}

export const getSamlConfig = (origin: string): SamlConfig => {
  return {...defaultSamlConfig, callbackUrl: `${origin}/api/auth/callback`}
}
