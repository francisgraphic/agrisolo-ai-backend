console.log("✅ weather.controller.js loaded");

const weatherService = require("../services/weather.service");

async function getWeather(req, res) {
  try {
    const weather = await weatherService.getFarmWeather(
      req.user.id,
      req.params.farmId
    );

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getWeather,
};