import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import { ListTestimonialsResponse, CreateTestimonialBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(item: typeof testimonialsTable.$inferSelect) {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
  };
}

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(asc(testimonialsTable.sortOrder), asc(testimonialsTable.createdAt));

  res.json(ListTestimonialsResponse.parse(testimonials.map(serialize)));
});

router.post("/testimonials", async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(serialize(item));
});

router.delete("/testimonials/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
