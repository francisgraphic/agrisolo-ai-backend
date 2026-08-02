-- CreateTable
CREATE TABLE "FarmActivity" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FarmActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
