const plannerService = require("../services/planner.service");

exports.createTask = async (req, res) => {
  try {
    const task = await plannerService.createTask(req.body);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to create task",
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await plannerService.getTasks(
      req.params.farmId
    );

    res.json(tasks);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to load tasks",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await plannerService.updateTask(
      req.params.id,
      req.body
    );

    res.json(task);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to update task",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await plannerService.deleteTask(req.params.id);

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to delete task",
    });
  }
};