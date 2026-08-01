const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/auth.routes");
const farmRoutes = require("./routes/farm.routes");
const weatherRoutes = require("./routes/weather.routes");
const cropRoutes = require("./routes/crop.routes");
const fertilizerRoutes = require("./routes/fertilizer.routes");
const diseaseRoutes = require("./routes/disease.routes");
const analysisRoutes = require("./routes/analysis.routes");
const visionRoutes = require("./routes/vision.routes");
const visionHistoryRoutes = require("./routes/visionHistory.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const chatRoutes = require("./routes/chat.routes");
const taskRoutes = require("./routes/task.routes");
const farmPlannerRoutes = require("./routes/farmPlanner.routes");
const notificationRoutes = require("./routes/notification.routes");
const farmChatRoutes = require("./routes/farmChat.routes");
const plannerRoutes = require("./routes/planner.routes");
const profileRoutes = require("./routes/profile.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

// ============================
// Middleware
// ============================

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ============================
// Health Check
// ============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Agrisolo AI API is running.",
    version: "1.0.0",
  });
});

// ============================
// Test Route
// ============================

app.get("/planner-test", (req, res) => {
  res.json({
    success: true,
    message: "Planner route is alive!",
  });
});

// ============================
// API Routes
// ============================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/farms", farmRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/crops", cropRoutes);
app.use("/api/v1/fertilizer", fertilizerRoutes);
app.use("/api/v1/disease", diseaseRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/v1/vision", visionRoutes);
app.use("/api/v1/vision/history", visionHistoryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/recommendation", recommendationRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/farm-chat", farmChatRoutes);
app.use("/api/v1/planner", plannerRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// ============================
// 404 Handler
// ============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ============================
// Global Error Handler
// ============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;