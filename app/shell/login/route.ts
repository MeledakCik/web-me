import { cookies } from "next/headers"

export async function login() {
  const cookieStore = cookies()

  ;(await cookieStore).set("shell_login", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  })
}