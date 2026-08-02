-- DropForeignKey
ALTER TABLE "FarmConversation" DROP CONSTRAINT "FarmConversation_farmId_fkey";

-- AlterTable
ALTER TABLE "FarmConversation" ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "metadata" JSONB;

-- AddForeignKey
ALTER TABLE "FarmConversation" ADD CONSTRAINT "FarmConversation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
