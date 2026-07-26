-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "farmId" TEXT,
ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
