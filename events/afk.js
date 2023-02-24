const client = require("../index");
const moment = require("moment");

client.on("message", (message) => {
  if (!message.guild || message.author.bot) return;

  const mentionedMember = message.mentions.members.first();
  if (mentionedMember) {
    const data = client.afk.get(mentionedMember.id);

    if (data) {
      const [timestamp, reason] = data;
      const timeAgo = moment(timestamp).fromNow();

      message.reply(
        `${mentionedMember} is currently afk (${timeAgo})\nReason: ${reason}`
      );
    }
  }

  const getData = client.afk.get(message.author.id);
  if (getData) {
    client.afk.delete(message.author.id);
    message.reply(`Welcome back, i have removed your afk!`);
  }
});
