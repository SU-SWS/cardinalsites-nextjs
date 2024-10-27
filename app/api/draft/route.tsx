import {NextRequest, NextResponse} from "next/server"
import {redirect} from "next/navigation"
import {cookies} from "next/headers"

export const revalidate = 0

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret")
  const slug = request.nextUrl.searchParams.get("slug")

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) return NextResponse.json({message: "Invalid token"}, {status: 401})

  if (!slug) return NextResponse.json({message: "Invalid slug path"}, {status: 401})

  const cookieValues = await cookies()
  cookieValues.set("preview", secret, {
    maxAge: 60 * 60,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    partitioned: true,
  })

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(`/preview${slug === "/home" ? "" : slug}`)
}
