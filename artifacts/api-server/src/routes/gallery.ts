import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, galleryItemsTable } from "@workspace/db";
import { ListGalleryItemsResponse, CreateGalleryItemBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(item: typeof galleryItemsTable.$inferSelect) {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
  };
}

router.get("/gallery", async (req, res): Promise<void> => {
  const { divisionSlug } = req.query as { divisionSlug?: string };
  const items = await db
    .select()
    .from(galleryItemsTable)
    .where(divisionSlug ? eq(galleryItemsTable.divisionSlug, divisionSlug) : undefined)
    .orderBy(asc(galleryItemsTable.sortOrder), asc(galleryItemsTable.createdAt));

  res.json(ListGalleryItemsResponse.parse(items.map(serialize)));
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db.insert(galleryItemsTable).values(parsed.data).returning();
  res.status(201).json(serialize(item));
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db.delete(galleryItemsTable).where(eq(galleryItemsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
