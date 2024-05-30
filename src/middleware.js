import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  const cookies = req.cookies.getAll();

  const authTokenCookie = cookies.find((cookie) =>
    cookie.name.endsWith("auth-token")
  );
  if (!authTokenCookie && req.nextUrl.pathname == "/upload") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (authTokenCookie && req.nextUrl.pathname == "/login") {
    return NextResponse.redirect(new URL("/upload", req.url));
  }
  return res;
}
