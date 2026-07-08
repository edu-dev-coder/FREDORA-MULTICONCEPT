import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  company: text("company"),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
  divisionSlug: text("division_slug"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonialsTable).omit({ id: true, createdAt: true });
export const selectTestimonialSchema = createSelectSchema(testimonialsTable);
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = z.infer<typeof selectTestimonialSchema>;
