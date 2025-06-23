import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode("nashjkahjhasjdjasjdahsjdhas")
    );
    return NextResponse.next();
  } catch (error) {}
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/mail", "/", "/log"],
};
