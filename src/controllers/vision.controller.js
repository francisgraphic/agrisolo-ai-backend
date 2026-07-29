const prisma = require("../config/prisma");
const visionService = require("../services/vision.service");
const cloudinaryService = require("../services/cloudinary.service");

// ======================================
// ANALYZE IMAGE
// ======================================
async function analyzeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const { farmId } = req.body;

    if (!farmId) {
      return res.status(400).json({
        success: false,
        message: "Farm ID is required.",
      });
    }

    // Ensure farm belongs to logged-in user
    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        ownerId: req.user.id,
      },
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found.",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinaryService.uploadImage(
      req.file.buffer
    );

    // Analyze image using Gemini Vision
    const aiResult = await visionService.analyzeCropImage(
      req.file.buffer
    );

    const analysis = JSON.parse(aiResult);

    // Save analysis
    const saved = await prisma.analysis.create({
      data: {
        crop: analysis.crop,
        health: analysis.health,
        disease: analysis.disease,
        confidence: Number(analysis.confidence),
        severity: analysis.severity,
        description: analysis.description,

        causes: analysis.causes,
        treatment: analysis.treatment,
        organicTreatment: analysis.organicTreatment,
        prevention: analysis.prevention,

        imageUrl: uploadedImage.secure_url,

        userId: req.user.id,
        farmId: farm.id,
      },
    });

    return res.status(201).json({
      success: true,
      data: saved,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    const message = error?.message || "";

    // Gemini quota exceeded
    if (
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("429") ||
      message.toLowerCase().includes("quota")
    ) {
      return res.status(429).json({
        success: false,
        code: "QUOTA_EXCEEDED",
        message:
          "Today's AI request limit has been reached. Please try again tomorrow.",
      });
    }

    return res.status(500).json({
      success: false,
      code: "AI_ERROR",
      message:
        "Unable to analyze your crop image at the moment. Please try again later.",
    });
  }
}

// ======================================
// GET HISTORY
// ======================================
async function getHistory(req, res) {
  try {
    const analyses = await prisma.analysis.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        farm: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: analyses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// GET SINGLE ANALYSIS
// ======================================
async function getAnalysis(req, res) {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        farm: true,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    return res.json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// DELETE ANALYSIS
// ======================================
async function deleteAnalysis(req, res) {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    await prisma.analysis.delete({
      where: {
        id: analysis.id,
      },
    });

    return res.json({
      success: true,
      message: "Analysis deleted successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// EXPORTS
// ======================================
module.exports = {
  analyzeImage,
  getHistory,
  getAnalysis,
  deleteAnalysis,
};