CREATE TABLE `admins` (
	`email` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `catalog_items` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`unit` text NOT NULL,
	`image_url` text NOT NULL,
	`capacity` text DEFAULT '' NOT NULL,
	`tag` text DEFAULT '' NOT NULL,
	`features_json` text DEFAULT '[]' NOT NULL,
	`sort_order` integer NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`hero_title` text NOT NULL,
	`hero_accent` text NOT NULL,
	`hero_script` text NOT NULL,
	`hero_subtitle` text NOT NULL,
	`hero_image` text NOT NULL,
	`experience_image` text NOT NULL,
	`updated_at` text NOT NULL
);
