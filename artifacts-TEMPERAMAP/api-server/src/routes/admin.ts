import { Router, type IRouter } from "express";
import { desc, sql, count, sum, eq, ilike, or, and } from "drizzle-orm";
import { db, profilesTable, testSessionsTable, paymentsTable, reportsTable, couponsTable, licensesTable, broadcastsTable } from "@workspace/db";
import {
  GetAdminDashboardResponse,
  ListAdminUsersQueryParams,
  ListAdminUsersResponse,
  ListAdminTestsQueryParams,
  ListAdminTestsResponse,
  GetRevenueTrendResponse,
  GetCompletionFunnelResponse,
  GetAdminUserResponse,
  ListAdminCouponsResponse,
  ListAdminCouponsResponseItem,
  CreateAdminCouponBody,
  UpdateAdminCouponBody,
  UpdateAdminCouponResponse,
  ListAdminLicensesResponse,
  ListAdminLicensesResponseItem,
  CreateAdminLicenseBody,
  UpdateAdminLicenseBody,
  UpdateAdminLicenseResponse,
  ListAdminBroadcastsResponse,
  ListAdminBroadcastsResponseItem,
  SendAdminBroadcastBody,
  ListAdminRolesResponse,
  GrantAdminRoleBody,
  GrantAdminRoleResponse,
  RevokeAdminRoleResponse,
} from "@workspace/api-zod";
import { serializeDates, serializeDatesArray } from "../lib/serializeDates";

const router: IRouter = Router();

router.get("/admin/dashboard", async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsersResult] = await db.select({ count: count() }).from(profilesTable);
  const [totalTestsResult] = await db.select({ count: count() }).from(testSessionsTable);
  const [testsTodayResult] = await db
    .select({ count: count() })
    .from(testSessionsTable)
    .where(sql`${testSessionsTable.createdAt} >= ${today}`);

  const [revenueTotalResult] = await db
    .select({ total: sum(paymentsTable.amount) })
    .from(paymentsTable)
    .where(sql`${paymentsTable.status} = 'success'`);

  const [revenueTodayResult] = await db
    .select({ total: sum(paymentsTable.amount) })
    .from(paymentsTable)
    .where(sql`${paymentsTable.status} = 'success' AND ${paymentsTable.createdAt} >= ${today}`);

  const recentPayments = await db
    .select()
    .from(paymentsTable)
    .orderBy(desc(paymentsTable.createdAt))
    .limit(5);

  const testsByTypeRows = await db
    .select({ testType: testSessionsTable.testType, count: count() })
    .from(testSessionsTable)
    .groupBy(testSessionsTable.testType);

  const testsByType: Record<string, number> = {};
  testsByTypeRows.forEach((row) => {
    testsByType[row.testType] = row.count;
  });

  const blendRows = await db
    .select({ primaryTemp: testSessionsTable.primaryTemp, count: count() })
    .from(testSessionsTable)
    .where(sql`${testSessionsTable.primaryTemp} IS NOT NULL`)
    .groupBy(testSessionsTable.primaryTemp);

  const temperamentBreakdown: Record<string, number> = {};
  blendRows.forEach((row) => {
    if (row.primaryTemp) temperamentBreakdown[row.primaryTemp] = row.count;
  });

  const stats = {
    totalUsers: totalUsersResult?.count ?? 0,
    totalTests: totalTestsResult?.count ?? 0,
    testsToday: testsTodayResult?.count ?? 0,
    revenueTotal: Number(revenueTotalResult?.total ?? 0),
    revenueToday: Number(revenueTodayResult?.total ?? 0),
    testsByType,
    recentPayments: serializeDatesArray(recentPayments),
    temperamentBreakdown,
  };

  res.json(GetAdminDashboardResponse.parse(stats));
});

router.get("/admin/revenue-trend", async (req, res): Promise<void> => {
  const rows = await db.execute(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
      DATE_TRUNC('month', created_at) AS month_date,
      COALESCE(SUM(amount), 0)::INTEGER AS revenue,
      COUNT(*)::INTEGER AS count
    FROM payments
    WHERE status = 'success'
      AND created_at >= NOW() - INTERVAL '12 months'
    GROUP BY month_date
    ORDER BY month_date ASC
  `);

  const trend = (rows.rows as Array<{ month: string; revenue: number; count: number }>).map((r) => ({
    month: r.month,
    revenue: Number(r.revenue),
    count: Number(r.count),
  }));

  res.json(GetRevenueTrendResponse.parse(trend));
});

router.get("/admin/funnel", async (req, res): Promise<void> => {
  const [registeredResult] = await db.select({ count: count() }).from(profilesTable);
  const [startedResult] = await db.select({ count: count() }).from(testSessionsTable);
  const [paidResult] = await db
    .select({ count: count() })
    .from(testSessionsTable)
    .where(eq(testSessionsTable.paid, true));
  const [completedResult] = await db
    .select({ count: count() })
    .from(testSessionsTable)
    .where(eq(testSessionsTable.status, "completed"));
  const [downloadedResult] = await db.select({ count: count() }).from(reportsTable);

  res.json(GetCompletionFunnelResponse.parse({
    registered: registeredResult?.count ?? 0,
    startedTest: startedResult?.count ?? 0,
    paid: paidResult?.count ?? 0,
    completed: completedResult?.count ?? 0,
    downloadedPdf: downloadedResult?.count ?? 0,
  }));
});

router.get("/admin/users", async (req, res): Promise<void> => {
  const params = ListAdminUsersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const limit = params.data.limit ?? 50;
  const offset = params.data.offset ?? 0;
  const search = params.data.search ?? "";

  let query = db.select().from(profilesTable).$dynamic();

  if (search) {
    query = query.where(
      or(
        ilike(profilesTable.fullName, `%${search}%`),
        ilike(profilesTable.email, `%${search}%`),
        ilike(profilesTable.phone, `%${search}%`)
      )
    );
  }

  const users = await query.orderBy(desc(profilesTable.createdAt)).limit(limit).offset(offset);

  const usersWithTestCount = await Promise.all(
    users.map(async (user) => {
      const [{ cnt }] = await db
        .select({ cnt: count() })
        .from(testSessionsTable)
        .where(sql`${testSessionsTable.userId} = ${user.id}`);
      return { ...user, testCount: cnt };
    })
  );

  res.json(ListAdminUsersResponse.parse(serializeDatesArray(usersWithTestCount)));
});

router.get("/admin/users/:userId", async (req, res): Promise<void> => {
  const { userId } = req.params;

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, userId));
  if (!profile) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const tests = await db
    .select()
    .from(testSessionsTable)
    .where(sql`${testSessionsTable.userId} = ${userId}`)
    .orderBy(desc(testSessionsTable.createdAt));

  const payments = await db
    .select()
    .from(paymentsTable)
    .where(sql`${paymentsTable.userId} = ${userId}`)
    .orderBy(desc(paymentsTable.createdAt));

  const reports = await db
    .select()
    .from(reportsTable)
    .where(sql`${reportsTable.userId} = ${userId}`)
    .orderBy(desc(reportsTable.createdAt));

  res.json(GetAdminUserResponse.parse(serializeDates({
    ...profile,
    tests: serializeDatesArray(tests),
    payments: serializeDatesArray(payments),
    reports: serializeDatesArray(reports),
  })));
});

router.get("/admin/tests", async (req, res): Promise<void> => {
  const params = ListAdminTestsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const limit = params.data.limit ?? 50;
  const offset = params.data.offset ?? 0;
  const search = (req.query.search as string) ?? "";
  const statusFilter = (req.query.status as string) ?? "";
  const testTypeFilter = (req.query.testType as string) ?? "";

  let query = db.select().from(testSessionsTable).$dynamic();

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(testSessionsTable.blend, `%${search}%`),
        ilike(testSessionsTable.primaryTemp, `%${search}%`)
      )
    );
  }
  if (statusFilter) conditions.push(eq(testSessionsTable.status, statusFilter));
  if (testTypeFilter) conditions.push(eq(testSessionsTable.testType, testTypeFilter));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const sessions = await query
    .orderBy(desc(testSessionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(ListAdminTestsResponse.parse(serializeDatesArray(sessions)));
});

router.get("/admin/export/users", async (req, res): Promise<void> => {
  const users = await db.select().from(profilesTable).orderBy(desc(profilesTable.createdAt));
  const usersWithCount = await Promise.all(
    users.map(async (user) => {
      const [{ cnt }] = await db
        .select({ cnt: count() })
        .from(testSessionsTable)
        .where(sql`${testSessionsTable.userId} = ${user.id}`);
      return { ...user, testCount: cnt };
    })
  );

  const header = "ID,Full Name,Email,Phone,Age Group,Tests Taken,Joined\n";
  const rows = usersWithCount.map((u) =>
    [
      u.id,
      `"${u.fullName ?? ""}"`,
      `"${u.email ?? ""}"`,
      `"${u.phone ?? ""}"`,
      u.ageGroup ?? "",
      u.testCount,
      u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
    ].join(",")
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.send(header + rows.join("\n"));
});

router.get("/admin/export/payments", async (req, res): Promise<void> => {
  const payments = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt));

  const header = "ID,Reference,Product,Status,Amount (kobo),Amount (NGN),User ID,Date\n";
  const rows = payments.map((p) =>
    [
      p.id,
      `"${p.paystackRef ?? ""}"`,
      p.product ?? "",
      p.status,
      p.amount,
      (p.amount / 100).toFixed(2),
      p.userId ?? "",
      p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    ].join(",")
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=payments.csv");
  res.send(header + rows.join("\n"));
});

router.get("/admin/export/tests", async (req, res): Promise<void> => {
  const tests = await db.select().from(testSessionsTable).orderBy(desc(testSessionsTable.createdAt));

  const header = "ID,Type,Status,Paid,Primary Temperament,Secondary Temperament,Blend,User ID,Date,Completed At\n";
  const rows = tests.map((t) =>
    [
      t.id,
      t.testType,
      t.status,
      t.paid ? "Yes" : "No",
      t.primaryTemp ?? "",
      t.secondaryTemp ?? "",
      `"${t.blend ?? ""}"`,
      t.userId ?? "",
      t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
      t.completedAt instanceof Date ? t.completedAt.toISOString() : (t.completedAt ?? ""),
    ].join(",")
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=tests.csv");
  res.send(header + rows.join("\n"));
});

router.get("/admin/coupons", async (req, res): Promise<void> => {
  const coupons = await db.select().from(couponsTable).orderBy(desc(couponsTable.createdAt));
  res.json(ListAdminCouponsResponse.parse(serializeDatesArray(coupons)));
});

router.post("/admin/coupons", async (req, res): Promise<void> => {
  const body = CreateAdminCouponBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const data: Record<string, unknown> = {
    code: body.data.code.toUpperCase(),
    discountPercent: body.data.discountPercent,
    isActive: true,
  };
  if (body.data.maxUses !== undefined) data.maxUses = body.data.maxUses;
  if (body.data.expiresAt) data.expiresAt = new Date(body.data.expiresAt);
  if (body.data.createdBy) data.createdBy = body.data.createdBy;

  const [coupon] = await db.insert(couponsTable).values(data as Parameters<typeof db.insert>[0] extends any ? any : never).returning();
  res.status(201).json(ListAdminCouponsResponseItem.parse(serializeDates(coupon)));
});

router.patch("/admin/coupons/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const body = UpdateAdminCouponBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.isActive !== undefined) updates.isActive = body.data.isActive;
  if (body.data.maxUses !== undefined) updates.maxUses = body.data.maxUses;
  if (body.data.expiresAt) updates.expiresAt = new Date(body.data.expiresAt);

  const [coupon] = await db.update(couponsTable).set(updates).where(eq(couponsTable.id, id)).returning();
  if (!coupon) { res.status(404).json({ error: "Coupon not found" }); return; }
  res.json(UpdateAdminCouponResponse.parse(serializeDates(coupon)));
});

router.delete("/admin/coupons/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  await db.delete(couponsTable).where(eq(couponsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/licenses", async (req, res): Promise<void> => {
  const licenses = await db.select().from(licensesTable).orderBy(desc(licensesTable.createdAt));
  res.json(ListAdminLicensesResponse.parse(serializeDatesArray(licenses)));
});

router.post("/admin/licenses", async (req, res): Promise<void> => {
  const body = CreateAdminLicenseBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const data: Record<string, unknown> = {
    licenseKey: body.data.licenseKey,
    testType: body.data.testType,
    totalSeats: body.data.totalSeats,
  };
  if (body.data.purchaserId) data.purchaserId = body.data.purchaserId;
  if (body.data.purchaserName) data.purchaserName = body.data.purchaserName;
  if (body.data.purchaserEmail) data.purchaserEmail = body.data.purchaserEmail;
  if (body.data.expiresAt) data.expiresAt = new Date(body.data.expiresAt);
  if (body.data.notes) data.notes = body.data.notes;

  const [license] = await db.insert(licensesTable).values(data as any).returning();
  res.status(201).json(ListAdminLicensesResponseItem.parse(serializeDates(license)));
});

router.patch("/admin/licenses/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const body = UpdateAdminLicenseBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.totalSeats !== undefined) updates.totalSeats = body.data.totalSeats;
  if (body.data.usedSeats !== undefined) updates.usedSeats = body.data.usedSeats;
  if (body.data.expiresAt) updates.expiresAt = new Date(body.data.expiresAt);
  if (body.data.notes !== undefined) updates.notes = body.data.notes;

  const [license] = await db.update(licensesTable).set(updates).where(eq(licensesTable.id, id)).returning();
  if (!license) { res.status(404).json({ error: "License not found" }); return; }
  res.json(UpdateAdminLicenseResponse.parse(serializeDates(license)));
});

router.get("/admin/broadcasts", async (req, res): Promise<void> => {
  const broadcasts = await db.select().from(broadcastsTable).orderBy(desc(broadcastsTable.createdAt));
  res.json(ListAdminBroadcastsResponse.parse(serializeDatesArray(broadcasts)));
});

router.post("/admin/broadcasts", async (req, res): Promise<void> => {
  const body = SendAdminBroadcastBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  let recipientCount = 0;
  if (body.data.recipientType === "all") {
    const [r] = await db.select({ count: count() }).from(profilesTable);
    recipientCount = r?.count ?? 0;
  } else if (body.data.recipientType === "completed") {
    const [r] = await db.select({ count: count() }).from(testSessionsTable).where(eq(testSessionsTable.status, "completed"));
    recipientCount = r?.count ?? 0;
  } else if (body.data.recipientType === "not_completed") {
    const [all] = await db.select({ count: count() }).from(profilesTable);
    const [done] = await db.select({ count: count() }).from(testSessionsTable).where(eq(testSessionsTable.status, "completed"));
    recipientCount = Math.max(0, (all?.count ?? 0) - (done?.count ?? 0));
  }

  const [broadcast] = await db
    .insert(broadcastsTable)
    .values({
      subject: body.data.subject,
      message: body.data.message,
      recipientType: body.data.recipientType,
      recipientCount,
      sentBy: body.data.sentBy ?? null,
    })
    .returning();

  res.status(201).json(ListAdminBroadcastsResponseItem.parse(serializeDates(broadcast)));
});

router.get("/admin/roles", async (req, res): Promise<void> => {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    res.status(503).json({ error: "Clerk not configured" });
    return;
  }

  try {
    const response = await fetch("https://api.clerk.com/v1/users?limit=100", {
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
    });
    const data = await response.json() as any[];
    const admins = data
      .filter((u: any) => u.public_metadata?.role === "admin")
      .map((u: any) => ({
        userId: u.id,
        email: u.email_addresses?.[0]?.email_address ?? null,
        fullName: [u.first_name, u.last_name].filter(Boolean).join(" ") || null,
        grantedAt: u.updated_at ? new Date(u.updated_at).toISOString() : null,
      }));

    res.json(ListAdminRolesResponse.parse(admins));
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch Clerk users");
    res.status(500).json({ error: "Failed to fetch admin roles" });
  }
});

router.post("/admin/roles", async (req, res): Promise<void> => {
  const body = GrantAdminRoleBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    res.status(503).json({ error: "Clerk not configured" });
    return;
  }

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${body.data.userId}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_metadata: { role: "admin" } }),
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(400).json({ error: `Clerk error: ${err}` });
      return;
    }

    res.json(GrantAdminRoleResponse.parse({ success: true }));
  } catch (err) {
    req.log?.error({ err }, "Failed to grant admin role");
    res.status(500).json({ error: "Failed to grant admin role" });
  }
});

router.delete("/admin/roles/:userId", async (req, res): Promise<void> => {
  const { userId } = req.params;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    res.status(503).json({ error: "Clerk not configured" });
    return;
  }

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_metadata: { role: null } }),
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(400).json({ error: `Clerk error: ${err}` });
      return;
    }

    res.json(RevokeAdminRoleResponse.parse({ success: true }));
  } catch (err) {
    req.log?.error({ err }, "Failed to revoke admin role");
    res.status(500).json({ error: "Failed to revoke admin role" });
  }
});

export default router;
