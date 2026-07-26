const cron = require("node-cron");
const prisma = require("../config/prisma");
const autonomousAI = require("../services/autonomousAI.service");

function startAIScheduler() {
  console.log("🤖 Agrisolo AI Scheduler Started");

  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    console.log("====================================");
    console.log("Running Autonomous Agrisolo AI...");
    console.log("Time:", new Date().toLocaleString());
    console.log("====================================");

    try {
      const farms = await prisma.farm.findMany({
        select: {
          id: true,
          ownerId: true,
          name: true,
        },
      });

      console.log(`Found ${farms.length} farms.`);

      for (const farm of farms) {
        try {
          console.log(`Monitoring ${farm.name}`);

          await autonomousAI.monitorFarm(
            farm.ownerId,
            farm.id
          );

          console.log(`Finished ${farm.name}`);
        } catch (err) {
          console.error(
            `Failed for ${farm.name}:`,
            err.message
          );
        }
      }

      console.log("Autonomous AI Finished.");
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = {
  startAIScheduler,
};