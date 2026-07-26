const farmChatRoutes = require("./routes/farmChat.routes");
const notificationRoutes = require("./routes/notification.routes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

console.log("✅ app.js loaded");

// Routes
const authRoutes = require("./routes/auth.routes");
const farmRoutes = require("./routes/farm.routes");
const weatherRoutes = require("./routes/weather.routes");
const cropRoutes = require("./routes/crop.routes");
const fertilizerRoutes = require("./routes/fertilizer.routes");
const diseaseRoutes = require("./routes/disease.routes");
const analysisRoutes = require("./routes/analysis.routes");
const visionRoutes = require("./routes/vision.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const chatRoutes = require("./routes/chat.routes");
const taskRoutes = require("./routes/task.routes");
const farmPlannerRoutes = require("./routes/farmPlanner.routes");

console.log("✅ auth.routes loaded");
console.log("✅ farm.routes loaded");
console.log("✅ weather.routes loaded");
console.log("✅ crop.routes loaded");
console.log("✅ fertilizer.routes loaded");
console.log("✅ disease.routes loaded");
console.log("✅ analysis.routes loaded");
console.log("✅ vision.routes loaded");
console.log("✅ dashboard.routes loaded");
console.log("✅ recommendation.routes loaded");
console.log("✅ task.routes loaded");
console.log("✅ chat.routes loaded");
console.log("✅ planner.routes loaded");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Agrisolo AI API is running",
  });
});

// ============================
// TEMP TEST ROUTE
// ============================
app.get("/planner-test", (req, res) => {
  res.json({
    success: true,
    message: "Planner route is alive!",
  });
});

// ============================
// ROUTE DEBUG
// ============================

console.log("=========== ROUTE DEBUG ===========");
console.log("authRoutes:", authRoutes);
console.log("farmRoutes:", farmRoutes);
console.log("weatherRoutes:", weatherRoutes);
console.log("cropRoutes:", cropRoutes);
console.log("fertilizerRoutes:", fertilizerRoutes);
console.log("diseaseRoutes:", diseaseRoutes);
console.log("analysisRoutes:", analysisRoutes);
console.log("visionRoutes:", visionRoutes);
console.log("dashboardRoutes:", dashboardRoutes);
console.log("recommendationRoutes:", recommendationRoutes);
console.log("taskRoutes:", taskRoutes);
console.log("chatRoutes:", chatRoutes);
console.log("farmPlannerRoutes:", farmPlannerRoutes);
console.log("===================================");

// ============================
// API ROUTES
// ============================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/farms", farmRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/crops", cropRoutes);
app.use("/api/v1/fertilizer", fertilizerRoutes);
app.use("/api/v1/disease", diseaseRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/v1/vision", visionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/recommendation", recommendationRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/planner", farmPlannerRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/farm-chat", farmChatRoutes);

module.exports = app;