import {NextResponse} from "next/server"
import {cookies} from "next/headers"

export const revalidate = 0

export const GET = async () => {
  const cookieValues = await cookies()
  cookieValues.delete("preview")
  return NextResponse.json({disabled: true}, {status: 200})
}
