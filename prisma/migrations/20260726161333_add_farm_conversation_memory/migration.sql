/*
  Warnings:

  - You are about to drop the column `title` on the `FarmConversation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FarmConversation` table. All the data in the column will be lost.
  - You are about to drop the `FarmMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `FarmConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `FarmConversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FarmMessage" DROP CONSTRAINT "FarmMessage_conversationId_fkey";

-- AlterTable
ALTER TABLE "FarmConversation" DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "FarmMessage";
