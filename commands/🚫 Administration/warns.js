const { Client, Message, MessageEmbed } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "warns",
  aliases: ["warnings"],
  category: "🚫 Administration",
  memberpermissions: ["MANAGE_GUILD"],
  cooldown: 5,
  description: "See Warnings Of a User",
  usage: "[COMMAND] + [@user]",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    const warnmember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    // if not member
    if (!warnmember) {
      message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(` Please Mention a User to See warnings`)
            .setFooter(ee.footertext)
        )
        .then((msg) => msg.delete({ timeout: 5000 }));
    }

    // if user is message author
    if (message.author?.id === warnmember?.id) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`You can't Check Your Own warnings`)
            .setFooter(ee.footertext)
        )
        .then((msg) => msg.delete({ timeout: 5000 }));
    }

    // if warn guild owner
    if (warnmember.id === message.guild.owner.id) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`You can't Check warnings Of Guild Owner`)
            .setFooter(ee.footertext)
        )
        .then((msg) => msg.delete({ timeout: 5000 }));
    }

    // database

    let warnings = client.db.get(
      `warnings_${message.guild.id}_${warnmember.id}`
    );

    if (warnings === null) warnings = 0;
    client.db.set(`warnings_${message.guild.id}_${warnmember.id}`, 1);
    await message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setDescription(
            ` <@${warnmember.id}>  Have  \`${warnings}\` Warnings in ${message.guild.name}`
          )
          .setFooter(ee.footertext)
      )
      .then((msg) => msg.delete({ timeout: 5000 }));
  },
};
