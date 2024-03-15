import {NextResponse} from "next/server";
import {draftMode} from 'next/headers'

export const revalidate = 0;

export async function GET() {
  draftMode().disable()
  return NextResponse.json({disabled: true});
}