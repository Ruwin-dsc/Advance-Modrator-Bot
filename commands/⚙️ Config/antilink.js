const { Client, Message } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "antilink",
  aliases: ["pl"],
  category: "⚙️ Config",
  memberpermissions: ["ADMINISTRATOR"],
  cooldown: 5,
  description: "Start lockdown in a channel",
  usage: "lock",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    if (!args[0]) {
      return message.channel.send(`Usage: \`${prefix}antilink <on|off>\``);
    }

    if (args[0] === "On" || args[0] === "on") {
      client.db.set(`antilink-${message.guild.id}`, true);
      message.reply(`Antilink now Enabled`);
    } else if (args[0] === "off" || args[0] === "Off") {
      client.db.set(`antilink-${message.guild.id}`, false);
      message.reply(`Antilink now Disabled`);
    }
  },
};
