exports.analyzeImage = async (req, res) => {
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

    // Ensure the farm belongs to the logged in user
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

    // Upload image
    const uploadedImage = await cloudinaryService.uploadImage(
      req.file.buffer
    );

    // Analyze image
    const result = await visionService.analyzeCropImage(
      req.file.buffer
    );

    const analysis = JSON.parse(result);

    // Save analysis
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

        imageUrl: uploadedImage.secure_url,

        userId: req.user.id,
        farmId: farm.id,
      },
    });

    res.json({
      success: true,
      data: saved,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};