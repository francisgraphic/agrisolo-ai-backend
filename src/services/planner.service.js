const prisma = require("../config/prisma");

async function createTask(data) {
  return prisma.planner.create({
    data,
  });
}

async function getTasks(farmId) {
  return prisma.planner.findMany({
    where: { farmId },
    orderBy: {
      dueDate: "asc",
    },
  });
}

async function updateTask(id, data) {
  return prisma.planner.update({
    where: { id },
    data,
  });
}

async function deleteTask(id) {
  return prisma.planner.delete({
    where: { id },
  });
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};