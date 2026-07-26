const diseases = {
  maize: {
    blight: {
      disease: "Northern Leaf Blight",
      treatment: [
        "Apply fungicide.",
        "Remove infected leaves.",
        "Rotate crops."
      ]
    },
    rust: {
      disease: "Maize Rust",
      treatment: [
        "Use resistant varieties.",
        "Apply fungicide if necessary."
      ]
    }
  },

  cassava: {
    mosaic: {
      disease: "Cassava Mosaic Disease",
      treatment: [
        "Remove infected plants.",
        "Control whiteflies."
      ]
    }
  },

  rice: {
    blast: {
      disease: "Rice Blast",
      treatment: [
        "Use certified seed.",
        "Apply recommended fungicide."
      ]
    }
  }
};

module.exports = diseases;