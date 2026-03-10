import {NextRequest, NextResponse} from "next/server"
import {getJWTCookieName, verifyJWT} from "@lib/auth/jwt-auth"

/**
 * GET /api/auth/user
 *
 * Returns the authenticated user's profile by verifying the JWT session cookie.
 * Clients can call this endpoint to check the current auth state and retrieve
 * user attributes (uid, mail, displayName, eduPersonAffiliation, etc.).
 *
 * @param req - Incoming Next.js request containing the `auth_token` cookie.
 * @returns 200 JSON with the `JWTPayload` (user profile + standard JWT claims)
 *          if the cookie is present and the token is valid and unexpired,
 *          or 401 JSON `{"error": "Unauthorized"}` otherwise.
 */
export const GET = async (req: NextRequest) => {
  // Read the JWT from the httpOnly session cookie.
  const token = req.cookies.get(getJWTCookieName())?.value

  if (!token) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  // Verify the token signature and expiry. Returns null if invalid or expired.
  const payload = await verifyJWT(token)

  if (!payload) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  return NextResponse.json(payload)
}
