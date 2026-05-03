import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";

const router: IRouter = Router();

function serializePost(p: typeof postsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  };
}

function validateSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug);
}

router.get("/posts", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.published, true))
    .orderBy(desc(postsTable.createdAt));
  res.json(posts.map(serializePost));
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [post] = await db.select().from(postsTable).where(eq(postsTable.slug, slug));
  if (!post || !post.published) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(serializePost(post));
});

router.get("/admin/posts", async (_req, res): Promise<void> => {
  const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  res.json(posts.map(serializePost));
});

router.post("/admin/posts", async (req, res): Promise<void> => {
  const { title, slug, excerpt, content, imageUrl, published } = req.body as Record<string, unknown>;
  if (!title || typeof title !== "string" || !slug || typeof slug !== "string" || !content || typeof content !== "string") {
    res.status(400).json({ error: "title, slug, and content are required strings" });
    return;
  }
  if (!validateSlug(slug as string)) {
    res.status(400).json({ error: "Slug must be lowercase alphanumeric with hyphens only" });
    return;
  }
  try {
    const [post] = await db.insert(postsTable).values({
      title: title as string,
      slug: slug as string,
      excerpt: (excerpt as string | null) ?? null,
      content: content as string,
      imageUrl: (imageUrl as string | null) ?? null,
      published: typeof published === "boolean" ? published : false,
    }).returning();
    res.status(201).json(serializePost(post));
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    throw err;
  }
});

router.patch("/admin/posts/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, slug, excerpt, content, imageUrl, published } = req.body as Record<string, unknown>;
  if (slug !== undefined && !validateSlug(slug as string)) {
    res.status(400).json({ error: "Slug must be lowercase alphanumeric with hyphens only" });
    return;
  }
  const updates: Partial<typeof postsTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title as string;
  if (slug !== undefined) updates.slug = slug as string;
  if (excerpt !== undefined) updates.excerpt = (excerpt as string | null) ?? null;
  if (content !== undefined) updates.content = content as string;
  if (imageUrl !== undefined) updates.imageUrl = (imageUrl as string | null) ?? null;
  if (published !== undefined) updates.published = published as boolean;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  const [post] = await db.update(postsTable).set(updates).where(eq(postsTable.id, id)).returning();
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  res.json(serializePost(post));
});

router.delete("/admin/posts/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(postsTable).where(eq(postsTable.id, id));
  res.sendStatus(204);
});

export default router;
