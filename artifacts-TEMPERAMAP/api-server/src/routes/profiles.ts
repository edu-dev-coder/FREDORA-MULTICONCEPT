import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
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
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, params.data.userId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse(serializeDates(profile)));
});

router.patch("/profiles/:userId", async (req, res): Promise<void> => {
  const params = UpdateProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateProfileBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [profile] = await db
    .update(profilesTable)
    .set({
      fullName: body.data.fullName,
      phone: body.data.phone,
      ageGroup: body.data.ageGroup,
    })
    .where(eq(profilesTable.id, params.data.userId))
    .returning();

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(UpdateProfileResponse.parse(serializeDates(profile)));
});

export default router;
