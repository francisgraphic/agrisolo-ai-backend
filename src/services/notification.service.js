const prisma = require("../config/prisma");
const ai = require("../config/gemini");

// =========================
// Create Notification
// =========================
async function createNotification(data) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      farmId: data.farmId || null,
      title: data.title,
      message: data.message,
      type: data.type || "AI",
    },
  });
}

// =========================
// Generate AI Notifications
// =========================
async function generateNotifications(userId, farmId) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
    include: {
      tasks: true,
      analyses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  const completedTasks = farm.tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = farm.tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const overdueTasks = farm.tasks.filter((task) => {
    return (
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
    );
  }).length;

  const prompt = `
You are Agrisolo AI.

Generate up to 3 useful notifications for this farm.

Farm:
${farm.name}

Crop:
${farm.cropType}

Country:
${farm.country}

State:
${farm.state}

Soil:
${farm.soilType}

Farm Size:
${farm.farmSize}

Completed Tasks:
${completedTasks}

Pending Tasks:
${pendingTasks}

Overdue Tasks:
${overdueTasks}

Recent Disease Analyses:
${JSON.stringify(farm.analyses)}

Return ONLY valid JSON.

Example:

[
  {
    "title":"Heavy Rain Expected",
    "message":"Delay fertilizer application until rainfall subsides.",
    "type":"Weather"
  },
  {
    "title":"Overdue Weeding",
    "message":"Your first weeding task is overdue.",
    "type":"Task"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    let raw = response.text;

    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const notifications = JSON.parse(raw);

    if (!Array.isArray(notifications)) {
      return [];
    }

    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          userId,
          farmId,
          title: notification.title,
          message: notification.message,
          type: notification.type || "AI",
        },
      });
    }

    return notifications;
  } catch (error) {
    console.error("Notification AI Error:", error.message);
    return [];
  }
}

// =========================
// Get Notifications
// =========================
async function getNotifications(userId) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// =========================
// Mark Notification Read
// =========================
async function markAsRead(userId, notificationId) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
}

// =========================
// Delete Notification
// =========================
async function deleteNotification(userId, notificationId) {
  return prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId,
    },
  });
}

module.exports = {
  createNotification,
  generateNotifications,
  getNotifications,
  markAsRead,
  deleteNotification,
};