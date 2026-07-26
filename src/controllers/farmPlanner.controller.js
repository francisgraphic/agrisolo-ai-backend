const farmPlannerService = require("../services/farmPlanner.service");

exports.generatePlan = async (req, res) => {
  try {
    const result = await farmPlannerService.generatePlan(
      req.user.id,
      req.params.farmId
    );

    res.json({
      success: true,
      message: `${result.createdTasks.length} tasks generated successfully.`,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};