const { Client, Message, MessageEmbed } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "antiword",
  aliases: ["aw"],
  category: "⚙️ Config",
  memberpermissions: ["ADMINISTRATOR"],
  cooldown: 5,
  description: "Setup Anti-Word in Server",
  usage: "antiword",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @returns
   */
  run: async (client, message, args, prefix) => {
    if (!args[0]) {
      return message.channel.send(`Usage: \`(prefix)antiwords <on|off>\``);
    }

    if (args[0] === "On" || args[0] === "on") {
      client.db.set(`antiword-${message.guild.id}`, true);
      message.reply(`antiword On`);
    } else if (args[0] === "Off" || args[0] === "off") {
      client.db.set(`antiword-${message.guild.id}`, false);
      message.reply(`antiword Off`);
    }
  },
};
