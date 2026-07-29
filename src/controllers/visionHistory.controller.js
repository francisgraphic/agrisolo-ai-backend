const historyService = require("../services/visionHistory.service");

async function getHistory(req, res) {
  try {
    const history = await historyService.getHistory(
      req.user.id
    );

    res.json({
      success: true,
      data: history,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getSingle(req, res) {
  try {
    const analysis =
      await historyService.getSingleAnalysis(
        req.user.id,
        req.params.id
      );

    res.json({
      success: true,
      data: analysis,
    });

  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

async function remove(req, res) {
  try {
    const result =
      await historyService.deleteAnalysis(
        req.user.id,
        req.params.id
      );

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getHistory,
  getSingle,
  remove,
};