PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_urls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`original_url` text NOT NULL,
	`short_code` text NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_urls`("id", "user_id", "original_url", "short_code", "clicks", "created_at", "updated_at") SELECT "id", "user_id", "original_url", "short_code", "clicks", "created_at", "updated_at" FROM `urls`;--> statement-breakpoint
DROP TABLE `urls`;--> statement-breakpoint
ALTER TABLE `__new_urls` RENAME TO `urls`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `urls_short_code_unique` ON `urls` (`short_code`);