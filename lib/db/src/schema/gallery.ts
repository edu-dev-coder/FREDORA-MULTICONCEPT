import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const galleryItemsTable = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  divisionSlug: text("division_slug"),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItemsTable).omit({ id: true, createdAt: true });
export const selectGalleryItemSchema = createSelectSchema(galleryItemsTable);
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = z.infer<typeof selectGalleryItemSchema>;
