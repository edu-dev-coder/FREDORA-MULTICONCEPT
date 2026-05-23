import { Router, type IRouter } from "express";
import { db, tmCouponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { serializeDates, serializeDatesArray } from "../lib/serializeDates";

const router: IRouter = Router();

router.post("/admin/tm/roles/:userId", async (req, res): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    res.status(503).json({ error: "Clerk not configured" }); return;
  }
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${clerkSecretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ public_metadata: { role: "admin" } }),
  });
  if (!response.ok) {
    const err = await response.text();
    res.status(400).json({ error: `Clerk error: ${err}` }); return;
  }
  res.json({ success: true });
});

router.delete("/admin/tm/roles/:userId", async (req, res): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    res.status(503).json({ error: "Clerk not configured" }); return;
  }
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${clerkSecretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ public_metadata: { role: null } }),
  });
  if (!response.ok) {
    const err = await response.text();
    res.status(400).json({ error: `Clerk error: ${err}` }); return;
  }
  res.json({ success: true });
});

router.get("/admin/tm/coupons", async (_req, res): Promise<void> => {
  const coupons = await db.select().from(tmCouponsTable);
  res.json(serializeDatesArray(coupons));
});

router.post("/admin/tm/coupons", async (req, res): Promise<void> => {
  const { code, discountPercent, maxUses } = req.body as { code: string; discountPercent: number; maxUses?: number };
  if (!code || discountPercent == null) {
    res.status(400).json({ error: "code and discountPercent required" }); return;
  }
  const [coupon] = await db.insert(tmCouponsTable).values({
    code: code.toUpperCase().trim(),
    discountPercent,
    maxUses: maxUses ?? null,
  }).returning();
  res.status(201).json(serializeDates(coupon));
});

router.delete("/admin/tm/coupons/:id", async (req, res): Promise<void> => {
  const { id } = req.params as { id: string };
  await db.delete(tmCouponsTable).where(eq(tmCouponsTable.id, id));
  res.json({ success: true });
});

export default router;
