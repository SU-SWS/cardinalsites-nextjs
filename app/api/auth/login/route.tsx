import {SAML} from "passport-saml/lib/node-saml"
import {NextRequest, NextResponse} from "next/server"
import {getSamlConfig} from "@lib/auth/saml-config"

/**
 * GET /api/auth/login
 *
 * Initiates a SAML SP-initiated SSO flow by generating a SAML AuthnRequest
 * and redirecting the browser to the IdP's SSO entry point.
 *
 * The page the user was trying to reach is encoded as RelayState so the
 * callback handler can redirect back to it after successful authentication.
 *
 * @param req - Incoming Next.js request. Reads:
 *   - `destination` query param  – explicit post-login redirect path
 *   - `Referer` header           – fallback post-login redirect path
 * @returns 302 redirect to the IdP login URL, or a JSON error response.
 */
export const GET = async (req: NextRequest) => {
  const samlConfig = await getSamlConfig(req.nextUrl.origin)
  try {
    // Validate required config before creating SAML instance
    if (!samlConfig.issuer) {
      console.error("❌ SAML_ISSUER environment variable is required")
      return NextResponse.json({error: "SAML configuration error: issuer is required"}, {status: 500})
    }

    if (!samlConfig.entryPoint) {
      console.error("❌ SAML_ENTRY_POINT environment variable is required")
      return NextResponse.json({error: "SAML configuration error: entryPoint is required"}, {status: 500})
    }

    // Determine where to send the user after a successful login.
    // Priority: explicit `destination` param > Referer header pathname > root.
    const refer = req.headers.get("referer")
    const relayState = req.nextUrl.searchParams.get("destination") || (refer ? new URL(refer).pathname : "/")
    const saml = new SAML(samlConfig)

    // Generate the SAML AuthnRequest and build the redirect URL for the IdP.
    const loginUrl = await saml.getAuthorizeUrlAsync(relayState, req.nextUrl.host, {})

    if (!loginUrl) {
      console.error("❌ Failed to generate login URL")
      return NextResponse.json({error: "Failed to generate login URL"}, {status: 500})
    }

    // Redirect the browser to the IdP so the user can authenticate.
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("❌ SAML login error occurred:")

    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)

      // Check if this is the specific issuer error we're tracking
      if (error.message.includes("issuer") && error.message.includes("option")) {
        console.error("🎯 This is the 'Bad options.issuer option' error!")
        console.error("SAML Config at error time:", {
          issuer: samlConfig.issuer,
          entryPoint: samlConfig.entryPoint,
          hasPrivateKey: !!samlConfig.privateKey,
          hasCert: !!samlConfig.cert,
        })
      }

      return NextResponse.json({error: "Authentication failed", details: error.message}, {status: 500})
    }

    return NextResponse.json({error: "Authentication failed", details: "unknown"}, {status: 500})
  }
}
