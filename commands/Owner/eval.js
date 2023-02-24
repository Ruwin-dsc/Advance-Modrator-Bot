const { Client, Message, MessageEmbed, TextChannel } = require("discord.js");
var ee = require("../../config/embed.json");
var config = require("../../config/config.json");

module.exports = {
  name: "eval",
  aliases: [""],
  category: " ",
  memberpermissions: [],
  cooldown: 5,
  description: "",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    let code = args.join(" ");
    if (!code) return message.reply("provide code dumb");
    function CheckFilter(object) {
      if (typeof object === "string") {
        object = object.replace(
          new RegExp(client.token || process.env.TOKEN, "gi"),
          "Nah Bro sorry check the console only smh"
        );
      } else if (typeof object === "object") {
        if (Array.isArray(object)) {
          for (let i = 0; i < object.length; i++) {
            object[i] = CheckFilter(object[i]);
          }
        } else {
          for (let key in object) {
            object[key] = CheckFilter(object[key]);
          }
        }
      }
      return object;
    }
    let oldSend = TextChannel.prototype.send;
    TextChannel.prototype.send = async function send(content, options) {
      return oldSend.bind(this)(CheckFilter(content), CheckFilter(options));
    };
    let evaled;
    try {
      evaled = eval(code);
      if (evaled instanceof Promise) evaled = await evaled;
    } catch (err) {
      evaled = err;
    }
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    evaled = new (require("string-toolkit"))().toChunks(evaled, 750);
    let reactions = ["❌", "⏪", "◀️", "⏹️", "▶️", "⏩"],
      page = 0,
      evaledEmbed = new MessageEmbed()
        .setColor("#303136")
        .setDescription(`\`\`\`js\n${evaled[0]}\n\`\`\``)
        .addField(`Type of`, `\`\`\`js\n${typeof evaled[0]}\n\`\`\``);
    let mainMessage = await message.reply(evaledEmbed);
    TextChannel.prototype.send = oldSend;
    await Promise.all(
      (evaled.length === 1 ? ["❌", "⏹️"] : reactions).map((r) =>
        mainMessage.react(r)
      )
    );
    let filter = (reaction, user) =>
      (evaled.length === 1 ? ["❌", "⏹️"] : reactions).some(
        (e) => e === reaction.emoji.name
      ) && user.id === message.author.id;
    let collector = mainMessage.createReactionCollector(filter, {
      time: 300000,
    });
    collector.on("collect", async (reaction, user) => {
      switch (reaction.emoji.name) {
        case "❌":
          await collector.stop();
          return mainMessage.delete();
          break;
        case "⏪":
          if (evaled.length === 1 || page === 0) return;
          page = 0;
          break;
        case "◀️":
          if (evaled.length === 1) return;
          if (page === 0) {
            page = evaled.length - 1;
          } else {
            page -= 1;
          }
          break;
        case "⏹️":
          await collector.stop();
          for (let reaction of mainMessage.reactions.cache.array()) {
            await reaction.users.remove(client.user.id);
          }
          return;
          break;
        case "▶️":
          if (evaled.length === 1) return;
          if (page === evaled.length - 1) {
            page = 0;
          } else {
            page += 1;
          }
          break;
        case "⏩":
          if (evaled.length === 1 || page === evaled.length - 1) return;
          page = evaled.length - 1;
          break;
      }
      evaledEmbed = new MessageEmbed()
        .setColor("#303136")
        .setDescription(`\`\`\`js\n${evaled[page]}\n\`\`\``)
        .addField(`Type of`, `\`\`\`js\n${typeof evaled[page]}\n\`\`\``);

      await mainMessage.edit({
        embed: evaledEmbed,
      });
    });
  },
};
