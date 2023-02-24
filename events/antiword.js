const { MessageEmbed } = require("discord.js");
const client = require("../index");

const badwords = [
  "fuck",
  "lund",
  "bc",
  "motherfucker",
  "chutiya",
  "porn",
  "sex",
];

client.on("message", (message) => {
  try {
    const messagedelete = () => {
      message.delete();
      message
        .reply(
          new MessageEmbed().setDescription(
            `\`\` No Bad Words Allowed In This Server!!!  \`\``
          )
        )
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    };
    let data = client.db.get(`antiword-${message.guild.id}`);
    if (data === true) {
      if (message.content.match(badwords)) {
        messagedelete();
      }
    }
  } catch (e) {
    message.channel.send(String(e));
  }
});
