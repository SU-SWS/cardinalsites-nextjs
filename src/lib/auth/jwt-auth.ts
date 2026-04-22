import {SignJWT, jwtVerify} from "jose"

const JWT_COOKIE_NAME = "auth_token"
const JWT_EXPIRES_IN = "1d"

// Read lazily so the value injected by Vault at startup (instrumentation.ts)
// is always picked up rather than a stale module-load-time snapshot.
const getJwtSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production")

export type UserProfile = {
  uid?: string
  mail?: string
  displayName?: string
  eduPersonAffiliation?: string[]
  eduPersonPrincipalName?: string
}

export type JWTPayload = UserProfile & {
  iat: number
  exp: number
  iss: string
}

/**
 * Generate JWT token from user profile
 */
export const generateJWT = async (profile: UserProfile): Promise<string> => {
  const jwt = new SignJWT(profile as Record<string, unknown>)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setIssuer("cardinal-sites-saml")
    .setExpirationTime(JWT_EXPIRES_IN)

  return await jwt.sign(getJwtSecretKey())
}

/**
 * Verify and decode JWT token
 */
export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  try {
    const {payload} = await jwtVerify(token, getJwtSecretKey(), {
      issuer: "cardinal-sites-saml",
    })
    return payload as JWTPayload
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification failed:", error.message)
    }
    return null
  }
}

/**
 * Get JWT cookie name
 */
export const getJWTCookieName = (): string => {
  return JWT_COOKIE_NAME
}

/**
 * Create secure cookie options
 */
export const getSecureCookieOptions = (maxAge: number = 24 * 60 * 60) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge, // 1 day by default
    path: "/",
  }
}
