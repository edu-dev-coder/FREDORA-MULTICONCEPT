import { pgTable, text, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

export const tmTestSessionsTable = pgTable("tm_test_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  testType: text("test_type").notNull().default("single_test"),
  status: text("status").notNull().default("in_progress"),
  paid: boolean("paid").notNull().default(false),
  paymentRef: text("payment_ref"),
  answers: jsonb("answers"),
  primaryTemp: text("primary_temp"),
  secondaryTemp: text("secondary_temp"),
  blend: text("blend"),
  results: jsonb("results"),
  partnerSessionId: uuid("partner_session_id"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmTestSession = typeof tmTestSessionsTable.$inferSelect;
export type InsertTmTestSession = typeof tmTestSessionsTable.$inferInsert;
