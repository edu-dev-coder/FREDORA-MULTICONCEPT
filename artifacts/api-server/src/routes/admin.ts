import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminsTable, divisionsTable, messagesTable, servicesTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminMeResponse,
  AdminLogoutResponse,
  GetAdminStatsResponse,
} from "@workspace/api-zod";

declare module "express-session" {
  interface SessionData {
    adminUsername?: string;
  }
}

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, parsed.data.username));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const validPassword = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!validPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.adminUsername = admin.username;
  res.json(AdminLoginResponse.parse({ success: true, username: admin.username }));
});

router.get("/admin/me", async (req, res): Promise<void> => {
  if (!req.session.adminUsername) {
    res.json(GetAdminMeResponse.parse({ loggedIn: false, username: null }));
    return;
  }

  res.json(GetAdminMeResponse.parse({ loggedIn: true, username: req.session.adminUsername }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json(AdminLogoutResponse.parse({ success: true }));
  });
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [divisionCount] = await db
    .select({ count: divisionsTable.id })
    .from(divisionsTable);

  const [messageCount] = await db
    .select({ count: messagesTable.id })
    .from(messagesTable);

  const [serviceCount] = await db
    .select({ count: servicesTable.id })
    .from(servicesTable);

  const allMessages = await db.select().from(messagesTable);
  const unreadMessages = allMessages.filter((m) => !m.read).length;

  const divisions = await db.select().from(divisionsTable);
  const messages = await db.select().from(messagesTable);
  const services = await db.select().from(servicesTable);

  res.json(
    GetAdminStatsResponse.parse({
      totalDivisions: divisions.length,
      totalMessages: messages.length,
      unreadMessages,
      totalServices: services.length,
    }),
  );
});

export default router;
