import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlidesTable).omit({ id: true, createdAt: true });
export const selectHeroSlideSchema = createSelectSchema(heroSlidesTable);
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = z.infer<typeof selectHeroSlideSchema>;
