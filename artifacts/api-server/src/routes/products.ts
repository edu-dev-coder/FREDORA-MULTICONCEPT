import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import { ListProductsResponse, CreateProductBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(item: typeof productsTable.$inferSelect) {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const { divisionSlug } = req.query as { divisionSlug?: string };
  const products = await db
    .select()
    .from(productsTable)
    .where(divisionSlug ? eq(productsTable.divisionSlug, divisionSlug) : undefined)
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.createdAt));

  res.json(ListProductsResponse.parse(products.map(serialize)));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(serialize(item));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
