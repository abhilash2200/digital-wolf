import type { MetadataRoute } from "next";

// TODO: add `sitemap` (and a sitemap.ts) once the production domain is confirmed —
// sitemap URLs must be absolute.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
