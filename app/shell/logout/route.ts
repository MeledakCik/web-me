import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  (await cookies()).delete("shell_login")

  return NextResponse.redirect(
    new URL("/shell/login", request.url)
  )
}