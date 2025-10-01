import {NextRequest, NextResponse} from "next/server"
import {manuallyDecryptSAMLResponse, extractProfileFromDecryptedXML} from "@lib/auth/manual-saml-decrypt"
import {generateJWT, getJWTCookieName, getSecureCookieOptions} from "@lib/auth/jwt-auth"
import {redirect} from "next/navigation"
import {cookies} from "next/headers"
import {getSamlConfig} from "@lib/auth/saml-config"

export const POST = async (req: NextRequest) => {
  const samlConfig = await getSamlConfig(req.nextUrl.origin)
  const body = await req.formData()
  const samlResponse = body.get("SAMLResponse") as string
  let relayState = (body.get("RelayState") as string) || "/"
  if (relayState == "/user/login") relayState = "/user"

  const cookieStore = await cookies()

  if (!samlResponse) {
    console.error("❌ No SAML response received")
    return NextResponse.json({error: "No SAML response received"}, {status: 400})
  }

  let decryptedXML: string | null = ""
  try {
    decryptedXML = await manuallyDecryptSAMLResponse(samlResponse, samlConfig.decryptionPvk as string)
  } catch (manualError) {
    console.error("❌ Manual decryption threw an error:")
    if (manualError instanceof Error) {
      console.error("Error message:", manualError.message)
      console.error("Error stack:", manualError.stack)
    }
    console.error("Full error object:", manualError)
    redirect("/internal/admin")
  }

  if (decryptedXML) {
    const profile = extractProfileFromDecryptedXML(decryptedXML)
    if (profile) {
      // Generate JWT token from the SAML profile
      const jwtToken = await generateJWT(profile)

      // Create response that redirects to the requested page.
      cookieStore.set(getJWTCookieName(), jwtToken, getSecureCookieOptions())
      redirect(relayState)
    } else {
      console.error("❌ Failed to extract profile from decrypted XML")
    }
  } else {
    console.error("❌ Failed to decrypt SAML response")
  }

  // Redirect to home page
  redirect("/")
}
