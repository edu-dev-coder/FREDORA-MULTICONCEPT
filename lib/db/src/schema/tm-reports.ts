import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tmReportsTable = pgTable("tm_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull(),
  userId: text("user_id"),
  reportUrl: text("report_url").notNull(),
  reportType: text("report_type").notNull().default("individual"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmReport = typeof tmReportsTable.$inferSelect;
export type InsertTmReport = typeof tmReportsTable.$inferInsert;
