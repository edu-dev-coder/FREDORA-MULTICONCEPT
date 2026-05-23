import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, testSessionsTable } from "@workspace/db";
import {
  ListTestsQueryParams,
  ListTestsResponse,
  CreateTestBody,
  GetTestParams,
  GetTestResponse,
  UpdateTestParams,
  UpdateTestBody,
  UpdateTestResponse,
} from "@workspace/api-zod";
import { serializeDates, serializeDatesArray } from "../lib/serializeDates";

const router: IRouter = Router();

router.get("/tests", async (req, res): Promise<void> => {
  const params = ListTestsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const sessions = await db
    .select()
    .from(testSessionsTable)
    .where(params.data.userId ? eq(testSessionsTable.userId, params.data.userId) : undefined)
    .orderBy(desc(testSessionsTable.createdAt));

  res.json(ListTestsResponse.parse(serializeDatesArray(sessions)));
});

router.post("/tests", async (req, res): Promise<void> => {
  const body = CreateTestBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [session] = await db
    .insert(testSessionsTable)
    .values({
      userId: body.data.userId ?? null,
      testType: body.data.testType,
      status: "in_progress",
      paid: true,
    })
    .returning();

  res.status(201).json(GetTestResponse.parse(serializeDates(session)));
});

router.get("/tests/:id", async (req, res): Promise<void> => {
  const params = GetTestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(testSessionsTable)
    .where(eq(testSessionsTable.id, params.data.id));

  if (!session) {
    res.status(404).json({ error: "Test session not found" });
    return;
  }

  // Basic ownership check: if the session belongs to a specific user,
  // ensure the requesting user matches (via x-user-id header or query param)
  const requestingUserId = req.headers["x-user-id"] as string | undefined
    ?? req.query["requestingUserId"] as string | undefined;

  if (session.userId && requestingUserId && session.userId !== requestingUserId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  res.json(GetTestResponse.parse(serializeDates(session)));
});

router.patch("/tests/:id", async (req, res): Promise<void> => {
  const params = UpdateTestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateTestBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.status !== undefined) updateData.status = body.data.status;
  if (body.data.answers !== undefined) updateData.answers = body.data.answers;
  if (body.data.results !== undefined) updateData.results = body.data.results;
  if (body.data.blend !== undefined) updateData.blend = body.data.blend;
  if (body.data.primaryTemp !== undefined) updateData.primaryTemp = body.data.primaryTemp;
  if (body.data.secondaryTemp !== undefined) updateData.secondaryTemp = body.data.secondaryTemp;
  if (body.data.partnerSessionId !== undefined) updateData.partnerSessionId = body.data.partnerSessionId;
  if (body.data.paid !== undefined) updateData.paid = body.data.paid;
  if (body.data.completedAt !== undefined) updateData.completedAt = new Date(body.data.completedAt);

  const [session] = await db
    .update(testSessionsTable)
    .set(updateData)
    .where(eq(testSessionsTable.id, params.data.id))
    .returning();

  if (!session) {
    res.status(404).json({ error: "Test session not found" });
    return;
  }

  res.json(UpdateTestResponse.parse(serializeDates(session)));
});

export default router;
