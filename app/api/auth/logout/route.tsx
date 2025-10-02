import {NextRequest, NextResponse} from "next/server"
import {getJWTCookieName} from "@lib/auth/jwt-auth"

export const GET = (req: NextRequest) => {
  const destination = req.nextUrl.searchParams.get("destination") || "/user/login"
  const response = NextResponse.redirect(new URL(destination, req.url))
  response.cookies.delete(getJWTCookieName())
  return response
}
