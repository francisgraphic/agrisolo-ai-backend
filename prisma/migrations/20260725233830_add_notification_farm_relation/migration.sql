-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "farmId" TEXT,
ALTER COLUMN "type" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
