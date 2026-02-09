import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/shell", "/shell/*"]
    },
    sitemap: "https://kasyaf-cv.vercel.app/sitemap.xml"
  }
}