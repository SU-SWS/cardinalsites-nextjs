import {NextRequest, NextResponse} from "next/server";

export const middleware = (request: NextRequest) => {
  const response = NextResponse.next()

  if (request.nextUrl.pathname.startsWith('/api/preview')) {
    const midnight = new Date();
    midnight.setHours(23);
    midnight.setMinutes(59);

    // Set the cookie to expire at midnight tonight.
    response.cookies.set({
      name: 'addEditoria11y',
      value: "true",
      path: '/',
      maxAge: Math.round(midnight.getTime() / 1000) - Math.round(new Date().getTime() / 1000)
    })
    return response;
  }

  if (!request.nextUrl.pathname.startsWith('/api') && request.nextUrl.searchParams.get('slug')) {
    return NextResponse.redirect(request.nextUrl.origin + request.nextUrl.pathname);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/preview',
  ],
}
