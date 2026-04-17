import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminsTable, divisionsTable, messagesTable, servicesTable, galleryItemsTable, productsTable, testimonialsTable, newsletterSubscribersTable } from "@workspace/db";
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
  const [
    divisions,
    messages,
    services,
    galleryItems,
    products,
    testimonials,
    subscribers,
  ] = await Promise.all([
    db.select().from(divisionsTable),
    db.select().from(messagesTable),
    db.select().from(servicesTable),
    db.select().from(galleryItemsTable),
    db.select().from(productsTable),
    db.select().from(testimonialsTable),
    db.select().from(newsletterSubscribersTable),
  ]);

  const unreadMessages = messages.filter((m) => !m.read).length;

  res.json(
    GetAdminStatsResponse.parse({
      totalDivisions: divisions.length,
      totalMessages: messages.length,
      unreadMessages,
      totalServices: services.length,
      totalProducts: products.length,
      totalGalleryItems: galleryItems.length,
      totalTestimonials: testimonials.length,
      totalSubscribers: subscribers.length,
    }),
  );
});

export default router;
