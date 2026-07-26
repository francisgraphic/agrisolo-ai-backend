-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "health" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "causes" JSONB NOT NULL,
    "treatment" JSONB NOT NULL,
    "organicTreatment" JSONB NOT NULL,
    "prevention" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
