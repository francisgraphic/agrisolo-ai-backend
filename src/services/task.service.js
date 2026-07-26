const prisma = require("../config/prisma");

// Create Task
async function createTask(userId, farmId, data) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  return prisma.task.create({
    data: {
      ...data,
      farmId,
      progress: data.progress || 0,
      status: data.status || "Pending",
    },
  });
}

// Get all tasks for a farm
async function getFarmTasks(userId, farmId) {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      ownerId: userId,
    },
  });

  if (!farm) {
    throw new Error("Farm not found.");
  }

  return prisma.task.findMany({
    where: {
      farmId,
    },
    orderBy: {
      dueDate: "asc",
    },
  });
}

// Alias
async function getTasks(userId, farmId) {
  return getFarmTasks(userId, farmId);
}

// Get one task
async function getTask(userId, taskId) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      farm: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  return task;
}

// Update Task
async function updateTask(userId, taskId, data) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      farm: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  const updateData = {
    ...data,
  };

  // Automatically set completion date
  if (data.status === "Completed") {
    updateData.progress = 100;
    updateData.completedAt = new Date();
  }

  // Automatically reset if task becomes pending again
  if (data.status === "Pending") {
    updateData.progress = 0;
    updateData.completedAt = null;
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: updateData,
  });
}

// Mark Task Completed
async function completeTask(userId, taskId) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      farm: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: "Completed",
      progress: 100,
      completedAt: new Date(),
    },
  });
}

// Delete Task
async function deleteTask(userId, taskId) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      farm: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return {
    message: "Task deleted successfully.",
  };
}

module.exports = {
  createTask,
  getFarmTasks,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  deleteTask,
};