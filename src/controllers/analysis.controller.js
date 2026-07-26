const analysisService = require("../services/analysis.service");

async function getAnalysis(req, res) {
  try {
    const result = await analysisService.getFarmAnalysis(
      req.user.id,
      req.params.farmId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getAnalysis,
};