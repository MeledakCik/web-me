import { cookies } from "next/headers"

export async function login() {
  (await cookies()).set("shell_login", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  })
}