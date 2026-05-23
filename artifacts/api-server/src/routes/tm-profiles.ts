import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, tmProfilesTable } from "@workspace/db";
import {
  GetProfileParams,
  GetProfileResponse,
  UpdateProfileParams,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";
import { serializeDates } from "../lib/serializeDates";

const router: IRouter = Router();

router.get("/profiles/:userId", async (req, res): Promise<void> => {
  const params = GetProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const [profile] = await db
    .select()
    .from(tmProfilesTable)
    .where(eq(tmProfilesTable.id, params.data.userId));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" }); return;
  }
  res.json(GetProfileResponse.parse(serializeDates(profile)));
});

router.patch("/profiles/:userId", async (req, res): Promise<void> => {
  const params = UpdateProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message }); return;
  }
  const body = UpdateProfileBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message }); return;
  }
  const existing = await db.select().from(tmProfilesTable).where(eq(tmProfilesTable.id, params.data.userId));
  let profile;
  if (existing.length === 0) {
    [profile] = await db.insert(tmProfilesTable).values({
      id: params.data.userId,
      fullName: body.data.fullName ?? null,
      phone: body.data.phone ?? null,
      ageGroup: body.data.ageGroup ?? null,
    }).returning();
  } else {
    [profile] = await db
      .update(tmProfilesTable)
      .set({
        fullName: body.data.fullName ?? undefined,
        phone: body.data.phone ?? undefined,
        ageGroup: body.data.ageGroup ?? undefined,
      })
      .where(eq(tmProfilesTable.id, params.data.userId))
      .returning();
  }
  res.json(UpdateProfileResponse.parse(serializeDates(profile!)));
});

export default router;
