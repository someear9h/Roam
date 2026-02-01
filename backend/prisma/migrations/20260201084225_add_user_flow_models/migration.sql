-- CreateTable
CREATE TABLE `UserPreferences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `travel_style` VARCHAR(191) NOT NULL DEFAULT 'balanced',
    `food_preference` VARCHAR(191) NOT NULL DEFAULT 'all',
    `pace` VARCHAR(191) NOT NULL DEFAULT 'moderate',
    `interests` JSON NOT NULL,
    `budget_level` VARCHAR(191) NOT NULL DEFAULT 'moderate',
    `onboarding_complete` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserPreferences_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripMemory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `data` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripFeedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `highlights` JSON NOT NULL,
    `improvements` TEXT NULL,
    `would_recommend` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TripFeedback_trip_id_key`(`trip_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
