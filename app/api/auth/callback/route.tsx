import {NextRequest, NextResponse} from "next/server"
import {manuallyDecryptSAMLResponse, extractProfileFromDecryptedXML} from "@lib/auth/manual-saml-decrypt"
import {generateJWT, getJWTCookieName, getSecureCookieOptions} from "@lib/auth/jwt-auth"
import {redirect} from "next/navigation"
import {cookies} from "next/headers"
import {getSamlConfig} from "@lib/auth/saml-config"

/**
 * POST /api/auth/callback
 *
 * Assertion Consumer Service (ACS) endpoint. Receives the SAML response posted
 * by the IdP after the user authenticates, validates and decrypts the assertion,
 * extracts the user profile, and issues a signed JWT session cookie.
 *
 * Expected form body fields:
 *   - `SAMLResponse`  – base64-encoded SAML response XML from the IdP (required)
 *   - `RelayState`    – the original destination path to redirect to after login
 *
 * On success:  redirects to `RelayState` with the `auth_token` cookie set.
 * On failure:  redirects to `/internal/admin` (decryption error) or `/` (other).
 *
 * @param req - Incoming Next.js request with `multipart/form-data` body.
 * @returns A redirect response; never returns a JSON body on the happy path.
 */
export const POST = async (req: NextRequest) => {
  const samlConfig = await getSamlConfig(req.nextUrl.origin)
  const body = await req.formData()
  const samlResponse = body.get("SAMLResponse") as string

  // Default to "/" if RelayState is missing; normalise the login page back to the
  // user dashboard since there is nothing to show on /user/login after auth.
  let relayState = (body.get("RelayState") as string) || "/"
  if (relayState === "/user/login") relayState = "/user"

  if (!samlResponse) {
    console.error("❌ No SAML response received")
    return NextResponse.json({error: "No SAML response received"}, {status: 400})
  }

  const cookieStore = await cookies()

  // Decrypt the SAML assertion using the SP private key.
  // passport-saml's built-in decryption has compatibility issues with some IdP
  // assertion formats, so we use a custom xml-encryption-based helper instead.
  let decryptedXML: string | null = null
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

      // Write the JWT as a secure httpOnly cookie and redirect to the originally
      // requested page so the user lands where they intended to go.
      cookieStore.set(getJWTCookieName(), jwtToken, getSecureCookieOptions())
      redirect(relayState)
    } else {
      console.error("❌ Failed to extract profile from decrypted XML")
    }
  } else {
    console.error("❌ Failed to decrypt SAML response")
  }

  // Fallback redirect to home page when profile extraction fails.
  redirect("/")
}
