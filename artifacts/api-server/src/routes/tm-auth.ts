import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { db, tmUsersTable } from "@workspace/db";
import { serializeDates } from "../lib/serializeDates";

const router: IRouter = Router();

declare module "express-session" {
  interface SessionData {
    tmUserId?: string;
  }
}

router.post("/tm/auth/register", async (req, res): Promise<void> => {
  const { email, password, firstName, lastName } = req.body as {
    email?: string; password?: string; firstName?: string; lastName?: string;
  };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" }); return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" }); return;
  }
  const existing = await db.select().from(tmUsersTable).where(eq(tmUsersTable.email, email.toLowerCase().trim()));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already registered" }); return;
  }
  const passwordHash = await bcryptjs.hash(password, 10);
  const [user] = await db.insert(tmUsersTable).values({
    email: email.toLowerCase().trim(),
    passwordHash,
    firstName: firstName?.trim() || null,
    lastName: lastName?.trim() || null,
  }).returning();
  req.session.tmUserId = user.id;
  const { passwordHash: _, ...safeUser } = serializeDates(user as Record<string, unknown>) as typeof user & Record<string, unknown>;
  res.status(201).json(safeUser);
});

router.post("/tm/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" }); return;
  }
  const [user] = await db.select().from(tmUsersTable).where(eq(tmUsersTable.email, email.toLowerCase().trim()));
  if (!user || !(await bcryptjs.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password" }); return;
  }
  req.session.tmUserId = user.id;
  const { passwordHash: _, ...safeUser } = serializeDates(user as Record<string, unknown>) as typeof user & Record<string, unknown>;
  res.json(safeUser);
});

router.get("/tm/auth/me", async (req, res): Promise<void> => {
  if (!req.session.tmUserId) {
    res.status(401).json({ error: "Not authenticated" }); return;
  }
  const [user] = await db.select().from(tmUsersTable).where(eq(tmUsersTable.id, req.session.tmUserId));
  if (!user) {
    req.session.tmUserId = undefined;
    res.status(401).json({ error: "User not found" }); return;
  }
  const { passwordHash: _, ...safeUser } = serializeDates(user as Record<string, unknown>) as typeof user & Record<string, unknown>;
  res.json(safeUser);
});

router.post("/tm/auth/logout", (req, res): void => {
  req.session.tmUserId = undefined;
  res.json({ success: true });
});

export default router;
