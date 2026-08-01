const memoryService = require("../services/memory.service");

exports.getMemory = async (req, res) => {
  try {
    const { farmId } = req.params;

    const memory = await memoryService.getRecentMemory(farmId);

    res.json({
      success: true,
      data: memory,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load memory",
    });

  }
};

exports.clearMemory = async (req, res) => {
  try {

    const { farmId } = req.params;

    await memoryService.clearMemory(farmId);

    res.json({
      success: true,
      message: "Memory cleared",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to clear memory",
    });

  }
};