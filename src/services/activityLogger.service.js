const farmActivity = require("./farmActivity.service");
const farmMemory = require("./farmMemory.service");

async function log({
  farmId,
  role = "system",
  type,
  title,
  message,
  metadata = {},
}) {

  // Save structured activity
  await farmActivity.logActivity({
    farmId,
    activityType: type,
    title,
    description: message,
    metadata,
  });

  // Save AI memory
  await farmMemory.saveMemory({
    farmId,
    role,
    title,
    message,
    eventType: type,
    metadata,
  });

}

module.exports = {
  log,
};