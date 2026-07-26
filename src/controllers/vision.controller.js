const visionService = require("../services/vision.service");
const cloudinaryService = require("../services/cloudinary.service");
const prisma = require("../config/prisma");

exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinaryService.uploadImage(req.file.buffer);

    // Analyze image with Gemini
    const result = await visionService.analyzeCropImage(req.file.buffer);
    const analysis = JSON.parse(result);

    // Save analysis to database
    const saved = await prisma.analysis.create({
      data: {
        crop: analysis.crop,
        health: analysis.health,
        disease: analysis.disease,
        confidence: analysis.confidence,
        severity: analysis.severity,
        description: analysis.description,
        causes: analysis.causes,
        treatment: analysis.treatment,
        organicTreatment: analysis.organicTreatment,
        prevention: analysis.prevention,

        // Save the Cloudinary URL
        imageUrl: uploadedImage.secure_url,

        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      data: saved,
    });

  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
    console.error("===========================");

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message: "AI service is currently busy. Please try again in a few seconds.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: analyses.length,
      data: analyses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAnalysis = async (req, res) => {
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

    res.json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    await prisma.analysis.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Analysis deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};