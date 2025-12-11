import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/", new URL("http://localhost:3000")), {
    status: 302,
  });

  // Borrar las cookies
  res.cookies.set("sb-access-token", "", { maxAge: 0 });
  res.cookies.set("sb-refresh-token", "", { maxAge: 0 });

  return res;
}
