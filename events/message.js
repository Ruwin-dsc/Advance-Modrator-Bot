const config = require("../config/config.json");
const ee = require("../config/embed.json");
const { MessageEmbed, Permissions } = require("discord.js");
const client = require("..");

client.on("message", async (message) => {
  try {
    if (!message.guild || !message.channel || message.author.bot) return;
    let prefix = config.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.reply(
          new MessageEmbed().setDescription(
            `<@${message.author.id}>To see all Commands type: \`${config.prefix}help\``
          )
        );
    }
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
      if (
        !message.member.permissions.has(
          Permissions.FLAGS[command.memberpermissions] || []
        )
      ) {
        return message.reply(
          `You Don't Have \`${command.memberpermissions}\` Permission to Use \`${command.name}\` Command!!`
        );
      } else if (
        !message.guild.me.permissions.has(
          Permissions.FLAGS[command.memberpermissions] || []
        )
      ) {
        return message.reply(
          `I Don't Have \`${command.memberpermissions}\` Permission to Use \`${command.name}\` Command!!`
        );
      } else {
        command.run(client, message, args, prefix);
      }
    }
  } catch (e) {
    console.log(String(e.stack).red);
  }
});

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
