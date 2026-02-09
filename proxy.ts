import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedPaths = [
  "/",
  "/dashboard",
  "/exploit",
  "/dump-facebook",
  "/mail",
  "/post-instagram",
  "/a2f-instagram",
  "/me",
  "/file",
  "/shell/login",
  "/shell/logout"
]

const honeypotPaths = [
  "/admin",
  "/wp-login.php",
  "/phpmyadmin",
  "/.env",
  "/config.php"
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // HONEYPOT
  if (honeypotPaths.includes(pathname)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // PROTEKSI /shell
  if (pathname.startsWith("/shell")) {
    if (pathname === "/shell/login" || pathname === "/shell/logout") {
      return NextResponse.next()
    }

    const isLogin = request.cookies.get("shell_login")?.value
    if (isLogin !== "1") {
      return NextResponse.redirect(new URL("/shell/login", request.url))
    }
  }

  // BLOCK PATH ANEH
  if (
    !allowedPaths.includes(pathname) &&
    !pathname.startsWith("/shell") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/:path*"
}