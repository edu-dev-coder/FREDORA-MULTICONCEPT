import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const divisionsTable = pgTable("divisions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  bannerColor: text("banner_color").notNull().default("#6b21a8"),
  comingSoon: boolean("coming_soon").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDivisionSchema = createInsertSchema(divisionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type Division = typeof divisionsTable.$inferSelect;
