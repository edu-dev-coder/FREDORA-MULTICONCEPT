import { Router, type IRouter } from "express";
import { db, postsTable, divisionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sitemap.xml", async (req, res): Promise<void> => {
  try {
    const forwarded = req.headers["x-forwarded-host"];
    const hostRaw = (Array.isArray(forwarded) ? forwarded[0] : (forwarded ?? req.headers.host ?? ""));
    const host = hostRaw.split(",")[0].trim() || "fredoramulticoncept.replit.app";
    const origin = `https://${host}`;

    const [posts, divisionRows] = await Promise.all([
      db
        .select({ slug: postsTable.slug, updatedAt: postsTable.updatedAt })
        .from(postsTable)
        .where(eq(postsTable.published, true)),
      db
        .select({ slug: divisionsTable.slug })
        .from(divisionsTable)
        .where(eq(divisionsTable.comingSoon, false)),
    ]);

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/contact", priority: "0.8", changefreq: "monthly" },
      { url: "/news", priority: "0.7", changefreq: "daily" },
      { url: "/catalogue", priority: "0.7", changefreq: "weekly" },
    ];

    const divisionPages = divisionRows.map((d) => ({
      url: `/divisions/${d.slug}`,
      priority: "0.8",
      changefreq: "weekly",
    }));

    const postPages = posts.map((p) => ({
      url: `/news/${p.slug}`,
      lastmod: p.updatedAt instanceof Date ? p.updatedAt.toISOString().split("T")[0] : undefined,
      priority: "0.6",
      changefreq: "monthly",
    }));

    type PageEntry = { url: string; priority: string; changefreq: string; lastmod?: string };
    const allPages: PageEntry[] = [...staticPages, ...divisionPages, ...postPages];

    const urlEntries = allPages
      .map(
        (page) =>
          `  <url>\n    <loc>${origin}${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ""}\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate sitemap" }); return;
  }
});

export default router;
