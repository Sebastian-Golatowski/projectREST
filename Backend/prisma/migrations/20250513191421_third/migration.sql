/*
  Warnings:

  - You are about to drop the column `userId` on the `note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `note` DROP FOREIGN KEY `Note_userId_fkey`;

-- DropIndex
DROP INDEX `Note_userId_fkey` ON `note`;

-- AlterTable
ALTER TABLE `note` DROP COLUMN `userId`;
