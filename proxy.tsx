import {NextRequest, NextResponse} from "next/server"
import {verifyJWT, getJWTCookieName} from "./src/lib/auth/jwt-auth"

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname
  const loginUrl = new URL("/api/auth/login", request.url)
  loginUrl.searchParams.set("destination", pathname)

  // Get JWT token from cookies
  const token = request.cookies.get(getJWTCookieName())?.value
  if (!token) return NextResponse.redirect(loginUrl)

  // Verify JWT token
  const payload = await verifyJWT(token)
  if (!payload) return NextResponse.redirect(loginUrl)

  // Add user info to request headers for use in pages/components
  const response = NextResponse.next()
  response.headers.set("x-user-id", payload.uid || "")
  response.headers.set("x-user-email", payload.mail || "")
  response.headers.set("x-user-name", payload.displayName || "")

  return response
}

// Change the matcher to desired url patterns.
// If this is changed, the directory /app/internal may need to be renamed,
// or removed if the whole site is behind authentication.
export const config = {
  matcher: ["/internal/:path*", "/user"],
}
