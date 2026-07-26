const diseaseService = require("../services/disease.service");

async function getPrediction(req, res) {
  try {
    const result = await diseaseService.getDiseasePrediction(
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
  getPrediction,
};