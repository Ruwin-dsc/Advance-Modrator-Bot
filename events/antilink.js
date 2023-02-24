const { MessageEmbed } = require("discord.js");
const client = require("../index");

client.on("message", (message) => {
  try {
    const messagedelete = () => {
      message.delete();
      message
        .reply(
          ` That link is not allowed. `
        )
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    };
    let data = client.db.get(`antilink-${message.guild.id}`);
    if (data === true) {
      if (
        message.content.match("https://") ||
        message.content.match("discord.gg") ||
        message.content.match("www.")
      ) {
        messagedelete();
      }
    }
  } catch (e) {
    message.channel.send(String(e));
  }
});
