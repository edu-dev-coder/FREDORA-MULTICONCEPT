import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, divisionsTable, servicesTable } from "@workspace/db";
import {
  GetDivisionParams,
  UpdateDivisionParams,
  UpdateDivisionBody,
  ListDivisionsResponse,
  GetDivisionResponse,
  UpdateDivisionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeService(s: typeof servicesTable.$inferSelect) {
  return {
    ...s,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
  };
}

function serializeDivision(div: typeof divisionsTable.$inferSelect, services: (typeof servicesTable.$inferSelect)[]) {
  return {
    ...div,
    createdAt: div.createdAt instanceof Date ? div.createdAt.toISOString() : div.createdAt,
    updatedAt: div.updatedAt instanceof Date ? div.updatedAt.toISOString() : div.updatedAt,
    services: services.map(serializeService),
  };
}

router.get("/divisions", async (_req, res): Promise<void> => {
  const divisions = await db
    .select()
    .from(divisionsTable)
    .orderBy(asc(divisionsTable.sortOrder));

  const allServices = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.sortOrder));

  const result = divisions.map((div) =>
    serializeDivision(div, allServices.filter((s) => s.divisionSlug === div.slug)),
  );

  res.json(ListDivisionsResponse.parse(result));
});

router.get("/divisions/:slug", async (req, res): Promise<void> => {
  const params = GetDivisionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [division] = await db
    .select()
    .from(divisionsTable)
    .where(eq(divisionsTable.slug, params.data.slug));

  if (!division) {
    res.status(404).json({ error: "Division not found" });
    return;
  }

  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.divisionSlug, params.data.slug))
    .orderBy(asc(servicesTable.sortOrder));

  res.json(GetDivisionResponse.parse(serializeDivision(division, services)));
});

router.patch("/divisions/:slug", async (req, res): Promise<void> => {
  const params = UpdateDivisionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateDivisionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [division] = await db
    .update(divisionsTable)
    .set(parsed.data)
    .where(eq(divisionsTable.slug, params.data.slug))
    .returning();

  if (!division) {
    res.status(404).json({ error: "Division not found" });
    return;
  }

  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.divisionSlug, params.data.slug))
    .orderBy(asc(servicesTable.sortOrder));

  res.json(UpdateDivisionResponse.parse(serializeDivision(division, services)));
});

export default router;
