ALTER TABLE `catalog_items` ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `gallery_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `hourly_rate` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `minimum_hours` integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `maximum_hours` integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `promo_pay_hours` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `promo_bonus_hours` integer DEFAULT 0 NOT NULL;