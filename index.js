const { Client, Collection } = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const config = require("./config/config.json");

// client define
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  allowedMentions : {
    parse : ['everyone','roles','users'],
  }
});
module.exports = client;

// //Loading discord-buttons
const dbs = require("discord-buttons");
dbs(client);

// Global Variables
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.afk = new Collection();
client.voiceCollection = new Collection();
client.cooldowns = new Collection();
client.category = fs.readdirSync("./commands/");
client.db = require("quick.db");

// Initialise discord giveaways
if (!Array.isArray(client.db.get("giveaways"))) client.db.set("giveaways", []);
const { GiveawaysManager } = require("discord-giveaways");
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database
    return client.db.get("giveaways");
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageId, giveawayData) {
    // Add the new giveaway to the database
    client.db.push("giveaways", giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageId, giveawayData) {
    // Get all giveaways from the database
    const giveaways = client.db.get("giveaways");
    // Remove the unedited giveaway from the array
    const newGiveawaysArray = giveaways.filter(
      (giveaway) => giveaway.messageId !== messageId
    );
    // Push the edited giveaway into the array
    newGiveawaysArray.push(giveawayData);
    // Save the updated array
    client.db.set("giveaways", newGiveawaysArray);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId) {
    // Get all giveaways from the database
    const giveaways = client.db.get("giveaways");
    // Remove the giveaway from the array
    const newGiveawaysArray = giveaways.filter(
      (giveaway) => giveaway.messageId !== messageId
    );
    // Save the updated array
    client.db.set("giveaways", newGiveawaysArray);
    // Don't forget to return something!
    return true;
  }
};

// Create a new instance of your new class
client.giveawaysManager = new GiveawayManagerWithOwnDatabase(client, {
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    embedColorEnd: "#000000",
    reaction: "🎉",
  },
  updateCountdownEvery: 3000,
});

// distube
const Distube = require("distube");
client.distube = new Distube(client, {
  searchSongs: false,
  emitNewSongOnly: false,
  highWaterMark: 1024 * 1021 * 64,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: config.customFilters,
});

["command", "events", "distube"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(process.env.token || config.token);

process.on("unhandledRejection", (reason, p) => {
  console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(" [Error_Handling] :: Multiple Resolves");
  console.log(type, promise, reason);
});
