const mongoose = require("mongoose");
const dns = require("dns");

const env = require("./env");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");
}

module.exports = connectDatabase;
