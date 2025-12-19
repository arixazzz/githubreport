// import { protectedRoutes } from "@/generated/generatedProtectedRoutes";
// import { jwtDecode } from "jwt-decode";
// import { NextRequest, NextResponse } from "next/server";
// import { match } from "path-to-regexp";

// export const config = {
//   matcher: "/((?!_next|.*\\..*|api).*)", // semua halaman, tapi kita filter manual
// };

// function isProtected(pathname: string): boolean {
//   return protectedRoutes.some((pattern) =>
//     match(pattern, { decode: decodeURIComponent })(pathname)
//   );
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const mode = process.env.NEXT_PUBLIC_MODE;
//   const token = request.cookies.get("accessToken")?.value;
//   const loginUrl = new URL("/login", request.url);

//   // ✅ Skip static files, preview, favicon, public routes
//   if (
//     mode === "UI" ||
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/static/") ||
//     pathname.startsWith("/favicon.ico") ||
//     /\.(.*)$/.test(pathname) ||
//     pathname === "/unauthorized"
//   ) {
//     return NextResponse.next();
//   }

//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 🚫 Sudah login tapi akses /login
//   if (token && pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // ✅ Only check protected routes
//   if (!isProtected(pathname)) {
//     return NextResponse.next(); // ⬅️ non-protected route, skip auth
//   }

//   // 🔐 Start auth check for protected route
//   if (!token) {
//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     const decoded: decodedProps = jwtDecode(token);
//     const now = Date.now() / 1000;

//     if (decoded.exp < now) {
//       const res = NextResponse.redirect(loginUrl);
//       res.cookies.delete("accessToken");
//       return res;
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT decode error:", err);
//     const res = NextResponse.redirect(loginUrl);
//     res.cookies.delete("accessToken");
//     return res;
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|.*\\..*).*)"],
};

interface AccessTokenPayload {
  sub: number;
  exp: number;
  roles: string[];
  permissions: string[];
}

// Define protected routes manually
// All routes except public ones require authentication
function isProtected(pathname: string): boolean {
  const publicRoutes = ["/login", "/complete-profile", "/unauthorized"];

  // Check if it's a public route
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if it's an API route
  const isApi = pathname.startsWith("/api");

  // Protected if not public and not API
  return !isPublic && !isApi;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const loginUrl = new URL("/login", request.url);

  // ===============================
  // 1. Public routes
  // ===============================
  if (
    pathname === "/login" ||
    pathname === "/complete-profile" ||
    pathname === "/unauthorized" ||
    pathname.startsWith("/api")
  ) {
    // Sudah login tapi buka /login
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ===============================
  // 2. Non-protected route
  // ===============================
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  // ===============================
  // 3. Protected route → token wajib
  // ===============================
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  let decoded: AccessTokenPayload;

  try {
    decoded = jwtDecode<AccessTokenPayload>(token);
  } catch (err) {
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("accessToken");
    return res;
  }

  // ===============================
  // 4. Token expired
  // ===============================
  const now = Math.floor(Date.now() / 1000);
  if (!decoded.exp || decoded.exp < now) {
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("accessToken");
    return res;
  }

  // ===============================
  // 5. RBAC PAGE LEVEL
  // ===============================
  // Define routes that require ADMIN role
  const adminOnlyRoutes = [
    "/manajemen-user",
    "/tables/admin",
    "/listing-project/create",
    "/listing-project/edit",
  ];

  // Check if current path requires ADMIN role
  const requiresAdmin = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAdmin) {
    // Check if user has ADMIN role
    const hasAdminRole = decoded.roles && decoded.roles.includes("ADMIN");

    if (!hasAdminRole) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}
