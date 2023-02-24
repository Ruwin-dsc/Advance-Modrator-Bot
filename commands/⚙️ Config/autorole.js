const { Client, Message, MessageEmbed } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "autorole",
  aliases: ["arole"],
  category: "⚙️ Config",
  memberpermissions: ["MANAGE_ROLES"],
  cooldown: 5,
  description: "Setup Auto Give In Server",
  usage: "autorole",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    if (!args[0]) {
      return message.channel.send(
        `\`Usage: ${prefix}autorole on/off <@role>\``
      );
    }
    if (args[0] == "on") {
      let role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]);
      if (!role) {
        return message.reply(`please mention a role`);
      } else {
        client.db.set(`autorole-${message.guild.id}`, role.id);

        message.channel.send(`Autorole is active and role set to ${role}`);
      }
    } else if (args[0] === "off") {
      client.db.set(`autorole-${message.guild.id}`, false);

      message.channel.send(`Autorole has been turned off!`);
    }
  },
};
