const fertilizerService = require("../services/fertilizer.service");

async function getRecommendation(req, res) {
  try {
    const result = await fertilizerService.getFertilizerRecommendation(
      req.user.id,
      req.params.farmId,
      req.params.crop
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
  getRecommendation,
};