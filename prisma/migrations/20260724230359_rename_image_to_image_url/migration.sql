/*
  Warnings:

  - You are about to drop the column `image` on the `Analysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;
