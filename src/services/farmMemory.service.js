const prisma = require("../config/prisma");

async function saveMemory({
    farmId,
    role,
    message,
    eventType = "conversation",
    metadata = {}
}) {
    return prisma.farmConversation.create({
        data: {
            farmId,
            role,
            message,
            eventType,
            metadata
        }
    });
}

async function getMemory(farmId, limit = 30) {
    return prisma.farmConversation.findMany({
        where: {
            farmId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: limit
    });
}

module.exports = {
    saveMemory,
    getMemory
};