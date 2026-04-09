import { Router, type IRouter } from "express";
import { db, homepageTable } from "@workspace/db";
import {
  UpdateHomepageBody,
  GetHomepageResponse,
  UpdateHomepageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeHomepage(h: typeof homepageTable.$inferSelect) {
  return {
    ...h,
    updatedAt: h.updatedAt instanceof Date ? h.updatedAt.toISOString() : h.updatedAt,
  };
}

router.get("/homepage", async (_req, res): Promise<void> => {
  let [homepage] = await db.select().from(homepageTable).limit(1);

  if (!homepage) {
    [homepage] = await db.insert(homepageTable).values({}).returning();
  }

  res.json(GetHomepageResponse.parse(serializeHomepage(homepage)));
});

router.patch("/homepage", async (req, res): Promise<void> => {
  const parsed = UpdateHomepageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let [homepage] = await db.select().from(homepageTable).limit(1);
  if (!homepage) {
    [homepage] = await db.insert(homepageTable).values({}).returning();
  }

  const [updated] = await db
    .update(homepageTable)
    .set(parsed.data)
    .returning();

  res.json(UpdateHomepageResponse.parse(serializeHomepage(updated)));
});

export default router;
