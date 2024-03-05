import {draftMode} from 'next/headers'
import {NextResponse} from "next/server";

export const revalidate = 0;

export async function GET() {
  draftMode().disable()
  return NextResponse.json({disabled: true});
}