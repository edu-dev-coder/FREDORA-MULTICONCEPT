import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, heroSlidesTable } from "@workspace/db";

const router: IRouter = Router();

const MAX_SLIDES = 10;

function serialize(slide: typeof heroSlidesTable.$inferSelect) {
  return {
    ...slide,
    createdAt: slide.createdAt instanceof Date ? slide.createdAt.toISOString() : slide.createdAt,
  };
}

router.get("/hero-slides", async (req, res): Promise<void> => {
  const slides = await db
    .select()
    .from(heroSlidesTable)
    .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.createdAt));
  res.json(slides.map(serialize));
});

router.post("/hero-slides", async (req, res): Promise<void> => {
  const { imageUrl } = req.body as { imageUrl?: string };
  if (!imageUrl) {
    res.status(400).json({ error: "imageUrl is required" });
    return;
  }

  const existing = await db.select().from(heroSlidesTable);
  if (existing.length >= MAX_SLIDES) {
    res.status(400).json({ error: `Maximum of ${MAX_SLIDES} hero slides allowed` });
    return;
  }

  const [slide] = await db
    .insert(heroSlidesTable)
    .values({ imageUrl, sortOrder: existing.length })
    .returning();

  res.status(201).json(serialize(slide));
});

router.delete("/hero-slides/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(heroSlidesTable)
    .where(eq(heroSlidesTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Hero slide not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
