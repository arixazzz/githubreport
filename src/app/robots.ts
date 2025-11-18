import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_URL;

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: "/private/", // update private rute
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
