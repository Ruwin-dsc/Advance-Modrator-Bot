const client = require("../index");

client.on("guildMemberAdd", async (member) => {
  try {
    let data = client.db.get(`autorole-${member.guild.id}`);
    if (data) {
      member.roles.add(data);
    }
  } catch (e) {
    console.log(e)
  }
});
