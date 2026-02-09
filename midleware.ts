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
]

const honeypotPaths = [
  "/admin",
  "/wp-login.php",
  "/phpmyadmin",
  "/.env",
  "/config.php",
]

export function midleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🍯 HONEYPOT
  if (honeypotPaths.includes(pathname)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // 🔐 PROTEKSI /shell (USER + PASS)
  if (pathname.startsWith("/shell")) {
    const auth = request.headers.get("authorization")

    if (!auth || !auth.startsWith("Basic ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Shell Access"',
        },
      })
    }

    const base64 = auth.split(" ")[1]
    const decoded = Buffer.from(base64, "base64").toString()
    const [user, pass] = decoded.split(":")

    if (
      user !== process.env.SHELL_USER ||
      pass !== process.env.SHELL_PASS
    ) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  // 🚫 BLOCK PATH ANEH
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
  matcher: "/:path*",
}