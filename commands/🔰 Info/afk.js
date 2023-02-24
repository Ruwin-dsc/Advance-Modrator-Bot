const { Client, Message, MessageEmbed } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "afk",
  aliases: [""],
  category: "🔰 Info",
  memberpermissions: ["SEND_MESSAGES"],
  cooldown: "",
  description: "Put User in AFK",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    const reason = args.join(" ") || "No reason!";

    client.afk.set(message.author.id, [Date.now(), reason]);

    message.reply(`You have been set as AFK. \`${reason}\``);
  },
};
