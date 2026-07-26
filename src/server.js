require("dotenv").config();

const app = require("./app");
const { startAIScheduler } = require("./jobs/aiScheduler");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Agrisolo AI running on http://localhost:${PORT}`);

  // Start Autonomous AI Scheduler
  startAIScheduler();
});