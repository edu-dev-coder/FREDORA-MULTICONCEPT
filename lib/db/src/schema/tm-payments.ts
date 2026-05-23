import { pgTable, text, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

export const tmPaymentsTable = pgTable("tm_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  sessionId: uuid("session_id"),
  amount: integer("amount").notNull(),
  paystackRef: text("paystack_ref").notNull(),
  product: text("product").notNull(),
  status: text("status").notNull().default("pending"),
  couponId: uuid("coupon_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TmPayment = typeof tmPaymentsTable.$inferSelect;
export type InsertTmPayment = typeof tmPaymentsTable.$inferInsert;
