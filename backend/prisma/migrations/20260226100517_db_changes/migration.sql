/*
  Warnings:

  - You are about to drop the `FlightBooking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlightInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FlightBooking` DROP FOREIGN KEY `FlightBooking_trip_id_fkey`;

-- AlterTable
ALTER TABLE `Trip` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'upcoming';

-- DropTable
DROP TABLE `FlightBooking`;

-- DropTable
DROP TABLE `FlightInventory`;
