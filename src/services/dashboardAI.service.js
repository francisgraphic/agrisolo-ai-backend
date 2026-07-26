const ai = require("../config/gemini");

async function generateDashboardInsights(data) {
  const prompt = `
You are a senior agronomist and farm consultant.

Analyze this farm and provide personalized recommendations.

Farm Information
----------------
Farm Name: ${data.farm.name}
Country: ${data.farm.country}
State: ${data.farm.state}
Farm Size: ${data.farm.farmSize} hectares
Soil Type: ${data.farm.soilType}
Crop: ${data.farm.cropType || "Not selected"}

Task Statistics
---------------
Total Tasks: ${data.statistics.totalTasks}
Completed: ${data.statistics.completedTasks}
Pending: ${data.statistics.pendingTasks}
In Progress: ${data.statistics.inProgressTasks}
Overdue: ${data.statistics.overdueTasks}
Completion: ${data.statistics.completionPercentage}%

Performance
-----------
Health Score: ${data.performance.healthScore}
Risk Level: ${data.performance.riskLevel}

Upcoming Task
-------------
${data.nextTask ? data.nextTask.title : "None"}

Recent Disease Analyses
-----------------------
${JSON.stringify(data.recentAnalyses)}

Return ONLY valid JSON.

Example:

{
  "recommendations":[
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "warning":"Warning here",
  "opportunity":"Opportunity here",
  "summary":"Overall farm summary"
}

Do not use markdown.

Return ONLY JSON.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  let raw = response.text;

  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(raw);
}

module.exports = {
  generateDashboardInsights,
};