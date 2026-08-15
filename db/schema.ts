import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const admins = sqliteTable("admins", {
  email: text("email").primaryKey(),
  createdAt: text("created_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  heroTitle: text("hero_title").notNull(),
  heroAccent: text("hero_accent").notNull(),
  heroScript: text("hero_script").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  heroImage: text("hero_image").notNull(),
  experienceImage: text("experience_image").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const catalogItems = sqliteTable("catalog_items", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  unit: text("unit").notNull(),
  imageUrl: text("image_url").notNull(),
  capacity: text("capacity").notNull().default(""),
  tag: text("tag").notNull().default(""),
  description: text("description").notNull().default(""),
  serviceLocation: text("service_location").notNull().default(""),
  serviceNotice: text("service_notice").notNull().default(""),
  featuresJson: text("features_json").notNull().default("[]"),
  galleryJson: text("gallery_json").notNull().default("[]"),
  hourlyRate: integer("hourly_rate").notNull().default(0),
  minimumHours: integer("minimum_hours").notNull().default(3),
  maximumHours: integer("maximum_hours").notNull().default(10),
  promoPayHours: integer("promo_pay_hours").notNull().default(0),
  promoBonusHours: integer("promo_bonus_hours").notNull().default(0),
  extrasJson: text("extras_json").notNull().default("[]"),
  serviceOptionsJson: text("service_options_json").notNull().default("[]"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  featuredOrder: integer("featured_order").notNull().default(0),
  featuredLabel: text("featured_label").notNull().default(""),
  popularDetail: text("popular_detail").notNull().default(""),
  sortOrder: integer("sort_order").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull(),
});
