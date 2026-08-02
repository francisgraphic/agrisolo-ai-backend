const prisma = require("../config/prisma");
const activityLogger = require("./activityLogger.service");

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

  const task = await prisma.task.create({
    data: {
      ...data,
      farmId,
      progress: data.progress || 0,
      status: data.status || "Pending",
    },
  });

  await activityLogger.log({
    farmId: task.farmId,
    role: "system",
    type: "task",
    title: task.title,
    message: task.description || "New farm task created.",
    metadata: {
      priority: task.priority,
      dueDate: task.dueDate,
    },
  });

  return task;
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

  if (data.status === "Completed") {
    updateData.progress = 100;
    updateData.completedAt = new Date();
  }

  if (data.status === "Pending") {
    updateData.progress = 0;
    updateData.completedAt = null;
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: updateData,
  });

  await activityLogger.log({
    farmId: updatedTask.farmId,
    role: "system",
    type: "task_updated",
    title: updatedTask.title,
    message: `Task updated. Status: ${updatedTask.status}`,
    metadata: {
      priority: updatedTask.priority,
      progress: updatedTask.progress,
    },
  });

  return updatedTask;
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

  const completedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: "Completed",
      progress: 100,
      completedAt: new Date(),
    },
  });

  await activityLogger.log({
    farmId: completedTask.farmId,
    role: "system",
    type: "task_completed",
    title: completedTask.title,
    message: "Task completed successfully.",
  });

  return completedTask;
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

  await activityLogger.log({
    farmId: task.farmId,
    role: "system",
    type: "task_deleted",
    title: task.title,
    message: "Task deleted.",
  });

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