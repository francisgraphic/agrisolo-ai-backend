const chatService = require("../services/chat.service");

// Send message to AI
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const result = await chatService.sendMessage(
      req.user.id,
      message,
      chatId
    );

    res.json({
      success: true,
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

// Get all chats
exports.getChats = async (req, res) => {
  try {
    const chats = await chatService.getChats(req.user.id);

    res.json({
      success: true,
      count: chats.length,
      data: chats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one chat
exports.getChat = async (req, res) => {
  try {
    const chat = await chatService.getChat(
      req.user.id,
      req.params.id
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      data: chat,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    const result = await chatService.deleteChat(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};