/*
  Warnings:

  - You are about to drop the column `soicalId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `soicalId`,
    ADD COLUMN `socialId` VARCHAR(191);
