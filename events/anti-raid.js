const { MessageEmbed } = require("discord.js");
const client = require("../index");

client.on("guildMemberAdd", async (member) => {
  try {
    let data = client.db.get(`antiraid-${member.guild.id}`);
    if (data === true) {
      const kickReason = "Anti-raidmode activated";
      try {
        await member.send(
          new MessageEmbed()
            .setTitle(`Server Under Lockdown`)
            .setDescription(
              `You have been kicked from **${member.guild.name}** with reason: **${kickReason}**`
            )
            .setColor("RED")
        );
        member.kick(kickReason).catch((e) => null);
      } catch (e) {
        throw e;
      }
    }
  } catch (e) {
    console.log(e);
  }
});
