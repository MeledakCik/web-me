import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// GET = tampilkan halaman login (atau redirect)
export async function GET(request: Request) {
  return NextResponse.json({ message: "Silakan login" })
}

// POST = set cookie untuk login
export async function POST(request: Request) {
  const cookieStore = await cookies()

  cookieStore.set("shell_login", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  })

  return NextResponse.json({ success: true })
}