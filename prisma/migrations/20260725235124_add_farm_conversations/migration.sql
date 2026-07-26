-- CreateTable
CREATE TABLE "FarmConversation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "FarmConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmMessage" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "FarmMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FarmConversation" ADD CONSTRAINT "FarmConversation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmMessage" ADD CONSTRAINT "FarmMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "FarmConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
