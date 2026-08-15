ALTER TABLE `catalog_items` ADD `extras_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `featured_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `featured_label` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `popular_detail` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `catalog_items` SET `extras_json` = '[{"id":"norteno","name":"Norteño en vivo","description":"Una hora de música en vivo a bordo.","price":3000,"unit":"por hora","active":true},{"id":"banda","name":"Banda en vivo","description":"Ambiente sinaloense para celebrar en grande.","price":5000,"unit":"por hora","active":true},{"id":"dj","name":"DJ a bordo","description":"Música y mezcla personalizada para tu grupo.","price":5000,"unit":"por servicio","active":true}]' WHERE `kind` = 'yacht' AND `extras_json` = '[]';--> statement-breakpoint
UPDATE `catalog_items` SET `featured` = true, `featured_order` = 1, `featured_label` = 'Más vendido', `popular_detail` = 'Hasta 6 pasajeros · Chofer incluido' WHERE `id` = 'suburban';--> statement-breakpoint
UPDATE `catalog_items` SET `featured` = true, `featured_order` = 2, `featured_label` = 'Recomendado', `popular_detail` = 'Hasta 17 personas · Tripulación' WHERE `id` = 'naught-snowing';--> statement-breakpoint
UPDATE `catalog_items` SET `featured` = true, `featured_order` = 3, `featured_label` = 'Promo', `popular_detail` = '4 pasajeros · Casco incluido' WHERE `id` = 'rzr';--> statement-breakpoint
UPDATE `catalog_items` SET `featured` = true, `featured_order` = 4, `featured_label` = 'Nuevo', `popular_detail` = 'Diversión extrema en el mar' WHERE `id` = 'jetcar';
