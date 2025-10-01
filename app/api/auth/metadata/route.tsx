import {SAML} from "passport-saml/lib/node-saml"
import {NextRequest, NextResponse} from "next/server"
import {getSamlConfig} from "@lib/auth/saml-config"
import {fetchCertFromVault} from "@lib/utils/vault"

export const GET = async (req: NextRequest) => {
  const samlConfig = await getSamlConfig(req.nextUrl.origin)
  try {
    const signingCert = await fetchCertFromVault(
      process.env.VAULT_SAML_SIGNING_KEY_PATH as string,
      process.env.VAULT_SAML_SIGNING_KEY_KEY as string
    )
    const saml = new SAML(samlConfig)
    // Generate SAML metadata - pass certificates as parameters, not in config
    const metadata = saml.generateServiceProviderMetadata(signingCert, signingCert)

    return new Response(metadata, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": 'inline; filename="metadata.xml"',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        details: error,
        hasSigningCert: !!process.env.SAML_SIGNING_CERT,
        hasPrivateKey: !!process.env.SAML_SP_PRIVATE_KEY,
      },
      {status: 500}
    )
  }
}
