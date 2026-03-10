import {NextRequest, NextResponse} from "next/server"
import {getJWTCookieName} from "@lib/auth/jwt-auth"

/**
 * GET /api/auth/logout
 *
 * Ends the user's session by deleting the JWT cookie and redirecting the
 * browser to the specified destination.
 *
 * Note: This is SP-initiated logout only. It does not perform SAML SLO
 * (Single Logout) — the user's session on the IdP remains active.
 *
 * @param req - Incoming Next.js request. Reads:
 *   - `destination` query param – redirect path after logout (defaults to `/user/login`)
 * @returns 302 redirect with a Set-Cookie header that clears `auth_token`.
 */
export const GET = (req: NextRequest) => {
  const destination = req.nextUrl.searchParams.get("destination") || "/user/login"

  // Build the redirect response first so we can mutate its cookie headers.
  const response = NextResponse.redirect(new URL(destination, req.url))

  // Delete the JWT session cookie to complete the logout.
  response.cookies.delete(getJWTCookieName())
  return response
}
