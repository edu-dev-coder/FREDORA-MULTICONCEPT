import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const tmCouponsTable = pgTable("tm_coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discountPercent: integer("discount_percent").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmCoupon = typeof tmCouponsTable.$inferSelect;
export type InsertTmCoupon = typeof tmCouponsTable.$inferInsert;
