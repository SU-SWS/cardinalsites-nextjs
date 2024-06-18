import {NextRequest, NextResponse} from "next/server"
import {revalidateTag} from "next/cache"

export const revalidate = 0

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) return NextResponse.json({message: "Invalid token"}, {status: 403})

  let path = request.nextUrl.searchParams.get("slug")
  if (!path || path.startsWith("/node/")) return NextResponse.json({message: "Invalid slug"}, {status: 400})

  const tagsInvalidated = ["paths", `paths:${path}`]
  if (path.startsWith("/tags/"))
    path
      .substring(6)
      .split("/")
      .map(tag => tagsInvalidated.push(tag))

  tagsInvalidated.map(tag => revalidateTag(tag))

  return NextResponse.json({revalidated: true, tags: tagsInvalidated})
}
