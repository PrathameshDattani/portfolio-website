import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { navItems } from "@/lib/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    ...navItems.map((n) => ({ url: `${base}${n.href}`, lastModified: now, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${base}/races/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
