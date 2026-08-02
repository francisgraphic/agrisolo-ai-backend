const prisma = require("../config/prisma");

async function logActivity({
    farmId,
    activityType,
    title,
    description = "",
    metadata = {}
}) {

    return prisma.farmActivity.create({
        data: {
            farmId,
            activityType,
            title,
            description,
            metadata
        }
    });

}

async function getRecentActivities(farmId, limit = 20) {

    return prisma.farmActivity.findMany({
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
    logActivity,
    getRecentActivities
};