import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ================== CONFIG ==================
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

const WINDOW_MS = 10_000
const MAX_REQ = 40
const ipStore = new Map<string, { count: number; last: number }>()

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get("user-agent") || ""
  if (pathname.startsWith("/shell")) {
    const isBot = /Googlebot|bingbot|Slurp|DuckDuckBot/i.test(ua)
    if (isBot) {
      return new NextResponse("Not Found", { status: 404 })
    }
  }

  // ================== HONEYPOT ==================
  if (honeypotPaths.includes(pathname)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // ================== RATE LIMIT ==================
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip")

  if (ip) {
    const now = Date.now()
    const rec = ipStore.get(ip)

    if (!rec) {
      ipStore.set(ip, { count: 1, last: now })
    } else {
      if (now - rec.last < WINDOW_MS) {
        rec.count++
        if (rec.count > MAX_REQ) {
          return new NextResponse("Too Many Requests", {
            status: 429,
            headers: { "Retry-After": "10" }
          })
        }
      } else {
        rec.count = 1
        rec.last = now
      }
    }
  }

  // ================== PROTEKSI /shell (COOKIE ONLY) ==================
  if (pathname.startsWith("/shell")) {
    if (pathname === "/shell/login" || pathname === "/shell/logout") {
      return NextResponse.next()
    }

    const isLogin = request.cookies.get("shell_login")?.value

    if (isLogin !== "1") {
      return NextResponse.redirect(
        new URL("/shell/login", request.url)
      )
    }
  }

  // ================== BLOCK PATH ANEH ==================
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