import {NextRequest, NextResponse} from "next/server"
import {getJWTCookieName, verifyJWT} from "@lib/auth/jwt-auth"

export const GET = async (req: NextRequest) => {
  // Get JWT token from cookies
  const token = req.cookies.get(getJWTCookieName())?.value

  if (!token) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  // Verify JWT token
  const payload = await verifyJWT(token)

  if (!payload) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }
  return NextResponse.json(payload)
}
