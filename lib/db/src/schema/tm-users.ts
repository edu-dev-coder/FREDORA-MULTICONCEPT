import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tmUsersTable = pgTable("tm_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmUser = typeof tmUsersTable.$inferSelect;
export type InsertTmUser = typeof tmUsersTable.$inferInsert;
