/*
  Warnings:

  - You are about to drop the column `location` on the `Farm` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Made the column `state` on table `Farm` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Farm` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "location",
ADD COLUMN     "community" TEXT,
ADD COLUMN     "cropType" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "irrigation" TEXT,
ADD COLUMN     "lga" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;
