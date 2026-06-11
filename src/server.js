const app = require("./app");
const connectDatabase = require("./config/database");
const dns = require ("dns");

dns.setServers(["1.1.1.1","8.8.8.8"])


const env = require("./config/env");

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Waygood evaluation API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
