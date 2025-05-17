/*
  Warnings:

  - A unique constraint covering the columns `[googleId,userId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Book_googleId_userId_key` ON `Book`(`googleId`, `userId`);
