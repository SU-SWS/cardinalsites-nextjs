import {SAML} from "passport-saml/lib/node-saml"
import {NextRequest, NextResponse} from "next/server"
import {getSamlConfig} from "@lib/auth/saml-config"
import {fetchFromVault} from "@lib/utils/vault"

/**
 * GET /api/auth/metadata
 *
 * Returns this application's SAML Service Provider metadata as XML.
 * The IdP administrator uses this document to register the SP and establish
 * the trust relationship (entity ID, ACS URL, signing certificate, etc.).
 *
 * The signing certificate is fetched from Vault at request time using the
 * `VAULT_SAML_SIGNING_KEY_PATH` / `VAULT_SAML_SIGNING_KEY_KEY` env vars.
 *
 * @param req - Incoming Next.js request (origin used to build the ACS URL).
 * @returns 200 `application/xml` response with SP metadata,
 *          or a 500 JSON error response if metadata generation fails.
 */
export const GET = async (req: NextRequest) => {
  const samlConfig = await getSamlConfig(req.nextUrl.origin)
  try {
    // Fetch the SP signing certificate from Vault. The same certificate is
    // passed for both the signing and encryption cert parameters because this
    // SP uses a single key pair for both purposes.
    const signingCert = await fetchFromVault<string>(
      process.env.VAULT_SAML_SIGNING_KEY_PATH as string,
      process.env.VAULT_SAML_SIGNING_KEY_KEY as string
    )
    const saml = new SAML(samlConfig)

    // Certificates are passed as arguments rather than embedded in the config
    // to avoid issues with passport-saml's metadata generation.
    const metadata = saml.generateServiceProviderMetadata(signingCert, signingCert)

    return new Response(metadata, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": 'inline; filename="metadata.xml"',
      },
    })
  } catch (error) {
    console.error("❌ Failed to generate SAML metadata:", error)
    return NextResponse.json({error: "Failed to generate metadata"}, {status: 500})
  }
}
