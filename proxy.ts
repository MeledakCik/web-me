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
  "/shell",
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
  const isBot = /Googlebot|bingbot|Slurp|DuckDuckBot/i.test(ua)
  if (isBot) {
    return NextResponse.next()
  }
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown"

  const now = Date.now()

  // 🕵️ Honeypot anti scanner
  if (honeypotPaths.includes(pathname)) {
    console.warn("HONEYPOT HIT:", ip, pathname)
    return new NextResponse("Forbidden", { status: 403 })
  }

  // 🚨 Rate limit anti DDOS
  const rec = ipStore.get(ip)
  if (!rec) {
    ipStore.set(ip, { count: 1, last: now })
  } else {
    if (now - rec.last < WINDOW_MS) {
      rec.count++
      if (rec.count > MAX_REQ) {
        console.warn("RATE LIMIT BLOCK:", ip)
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

  // 🔐 Proteksi /shell pakai BASIC AUTH
  if (pathname.startsWith("/shell") && pathname !== "/shell/logout") {
    const auth = request.headers.get("authorization")

    if (!auth || !auth.startsWith("Basic ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="CIKAWAN SHELL"',
          "Cache-Control": "no-store"
        }
      })
    }

    const base64 = auth.replace("Basic ", "")
    const decoded = atob(base64)
    const [user, pass] = decoded.split(":")

    if (
      user !== process.env.SHELL_USER ||
      pass !== process.env.SHELL_PASS
    ) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  // 🚫 Block path aneh
  if (
    !allowedPaths.includes(pathname) &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.rewrite(new URL("/not-found", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/:path*"
}