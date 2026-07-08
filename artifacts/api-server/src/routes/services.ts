import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";

const router: IRouter = Router();

function serialize(item: typeof servicesTable.$inferSelect) {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
  };
}

router.patch("/services/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { imageUrl, price } = req.body as { imageUrl?: string | null; price?: string | null };

  const updates: Partial<typeof servicesTable.$inferInsert> = {};
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (price !== undefined) updates.price = price;

  const [updated] = await db
    .update(servicesTable)
    .set(updates)
    .where(eq(servicesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  res.json(serialize(updated));
});

export default router;
