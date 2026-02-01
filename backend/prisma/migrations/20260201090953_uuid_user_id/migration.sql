/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Trip` DROP FOREIGN KEY `Trip_user_id_fkey`;

-- DropIndex
DROP INDEX `Trip_user_id_fkey` ON `Trip`;

-- AlterTable
ALTER TABLE `Trip` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserPreferences` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreferences` ADD CONSTRAINT `UserPreferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
