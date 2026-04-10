import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const homepageTable = pgTable("homepage", {
  id: serial("id").primaryKey(),
  heroTitle: text("hero_title").notNull().default("Fredora Multiconcept"),
  heroSubtitle: text("hero_subtitle").notNull().default("A Nigerian company dedicated to excellence across multiple sectors"),
  motto: text("motto").notNull().default("Giving you the best of your needs."),
  missionStatement: text("mission_statement").notNull().default("To deliver exceptional products and services that improve lives across Nigeria and beyond, through innovation, integrity, and commitment to quality."),
  visionStatement: text("vision_statement").notNull().default("To be Africa's most trusted multi-sector company, recognized for excellence, sustainability, and positive community impact."),
  coreValues: text("core_values").array().notNull().default(["Integrity", "Excellence", "Innovation", "Community", "Sustainability"]),
  heroImageUrl: text("hero_image_url"),
  whatsappNumber: text("whatsapp_number"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  metaDescription: text("meta_description"),
  googleAnalyticsId: text("google_analytics_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertHomepageSchema = createInsertSchema(homepageTable).omit({ id: true, updatedAt: true });
export type InsertHomepage = z.infer<typeof insertHomepageSchema>;
export type Homepage = typeof homepageTable.$inferSelect;
