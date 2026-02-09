"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export const metadata = {
  robots: {
    index: false,
    follow: false
  }
}
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/me")
  }, [router])

  return null
}
