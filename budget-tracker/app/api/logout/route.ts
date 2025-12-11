import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { success: true, message: "Sesión cerrada" },
    { status: 200 }
  );

  // Limpiar cookies http-only
  res.cookies.set("sb-access-token", "", { 
    httpOnly: true,
    path: "/",
    maxAge: 0 
  });
  res.cookies.set("sb-refresh-token", "", { 
    httpOnly: true,
    path: "/",
    maxAge: 0 
  });

  return res;
}

