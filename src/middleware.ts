import { protectedRoutes } from "@/generated/generatedProtectedRoutes";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";

export const config = {
  matcher: "/((?!_next|.*\\..*|api).*)", // semua halaman, tapi kita filter manual
};

function isProtected(pathname: string): boolean {
  return protectedRoutes.some((pattern) =>
    match(pattern, { decode: decodeURIComponent })(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const mode = process.env.NEXT_PUBLIC_MODE;
  const token = request.cookies.get("accessToken")?.value;
  const loginUrl = new URL("/login", request.url);

  // ✅ Skip static files, preview, favicon, public routes
  if (
    mode === "UI" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(.*)$/.test(pathname) ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  // 🚫 Sudah login tapi akses /login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Only check protected routes
  if (!isProtected(pathname)) {
    return NextResponse.next(); // ⬅️ non-protected route, skip auth
  }

  // 🔐 Start auth check for protected route
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded: decodedProps = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("accessToken");
      return res;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT decode error:", err);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("accessToken");
    return res;
  }
}
