const taskService = require("../services/task.service");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(
      req.user.id,
      req.params.farmId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all tasks for a farm
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(
      req.user.id,
      req.params.farmId
    );

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one task
exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTask(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete Task
exports.completeTask = async (req, res) => {
  try {
    const task = await taskService.completeTask(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Task completed successfully.",
      data: task,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};