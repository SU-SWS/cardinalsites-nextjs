import {NextRequest, NextResponse} from "next/server"
import {revalidateTag} from "next/cache"
import {getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET)
    return NextResponse.json({message: "Invalid token"}, {status: 403})

  let path = request.nextUrl.searchParams.get("path")
  if (!path) return NextResponse.json({message: "Invalid Path"}, {status: 400})

  if (path.startsWith("/node/")) {
    // Fetch the teaser data to avoid the possibly cached page fetch.
    const {entity} = await getEntityFromPath(path, false, true)
    path = entity?.path || null
    if (!path) return NextResponse.json({message: "Invalid Path"}, {status: 400})
  }

  const tagsInvalidated = path.includes("/tags/") ? [] : [`paths:${path}`]
  if (path.startsWith("/tags/"))
    path
      .substring(6)
      .split("/")
      .map(tag => tagsInvalidated.push(tag))

  // When the home page is saved, it's url slug might be like `/home`. If the home page matches the slug, invalidate
  // the home page path.
  if ((await getHomePagePath()) === path) tagsInvalidated.push("paths:/")

  tagsInvalidated.map(tag => revalidateTag(tag, "max"))

  return NextResponse.json({revalidated: true, tags: tagsInvalidated})
}

export const POST = async (request: NextRequest) => {
  const auth = request.headers.get("Authorization")

  if (auth !== `Bearer ${process.env.DRUPAL_REVALIDATE_SECRET}`)
    return NextResponse.json({message: "Invalid token"}, {status: 403})

  // Parse the incoming JSON body
  const {paths, tags} = (await request.json()) as {paths?: string[]; tags?: string[]}
  paths?.map(path => revalidateTag(`paths:${path}`, "max"))
  tags?.map(tag => revalidateTag(tag, "max"))
  return NextResponse.json({revalidated: true, paths, tags})
}
