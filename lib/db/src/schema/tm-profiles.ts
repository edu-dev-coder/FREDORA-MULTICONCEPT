import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tmProfilesTable = pgTable("tm_profiles", {
  id: text("id").primaryKey(),
  fullName: text("full_name"),
  phone: text("phone"),
  ageGroup: text("age_group"),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmProfile = typeof tmProfilesTable.$inferSelect;
export type InsertTmProfile = typeof tmProfilesTable.$inferInsert;
