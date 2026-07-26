const recommendationService = require("../services/recommendation.service");

// Get AI Crop Recommendation
exports.getRecommendation = async (req, res) => {
  try {
    const recommendation = await recommendationService.recommendCrop(
      req.user.id,
      req.params.farmId
    );

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};