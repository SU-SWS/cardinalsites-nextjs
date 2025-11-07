import {SAML} from "passport-saml/lib/node-saml"
import {NextRequest, NextResponse} from "next/server"
import {getSamlConfig} from "@lib/auth/saml-config"

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

    const refer = req.headers.get("referer")
    const relayState = req.nextUrl.searchParams.get("destination") || (refer ? new URL(refer).pathname : "/")
    const saml = new SAML(samlConfig)

    // Generate the SAML request URL
    const loginUrl = await saml.getAuthorizeUrlAsync(relayState, req.nextUrl.host, {})

    if (!loginUrl) {
      console.error("❌ Failed to generate login URL")
      return NextResponse.json({error: "Failed to generate login URL"}, {status: 500})
    }

    // Redirect to the SAML IdP
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error("❌ SAML login error occurred:")
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")

    if (error instanceof Error) {
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
    }

    const details = error instanceof Error ? error.message : "unknown"
    return NextResponse.json({error: "Authentication failed", details}, {status: 500})
  }
}
