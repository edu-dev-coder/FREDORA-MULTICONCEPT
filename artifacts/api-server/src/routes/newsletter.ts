import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { SubscribeNewsletterBody, ListNewsletterSubscribersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(item: typeof newsletterSubscribersTable.$inferSelect) {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
  };
}

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please provide a valid email address" });
    return;
  }

  try {
    await db.insert(newsletterSubscribersTable).values({ email: parsed.data.email });
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "This email is already subscribed" });
      return;
    }
    throw err;
  }
});

router.get("/newsletter/subscribers", async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(asc(newsletterSubscribersTable.createdAt));

  res.json(ListNewsletterSubscribersResponse.parse(subscribers.map(serialize)));
});

export default router;
