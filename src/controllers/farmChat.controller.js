const farmChatService = require("../services/farmChat.service");

exports.chatWithFarm = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const response = await farmChatService.chatWithFarm(
      req.user.id,
      req.params.farmId,
      message
    );

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};