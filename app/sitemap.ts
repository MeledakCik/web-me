import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {

      url: "https://kasyaf-cv.vercel.app/",
      lastModified: new Date(),
      priority: 1.0
    },
    {
      url: "https://kasyaf-cv.vercel.app/dashboard",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://kasyaf-cv.vercel.app/me",
      lastModified: new Date(),
      priority: 1.0
    }
  ]
}