const dashboardService = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getDashboard(
    req.user.id,
    req.params.farmId
);

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};