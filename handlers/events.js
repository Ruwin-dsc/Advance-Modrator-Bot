const { readdirSync } = require("fs");
module.exports = async (client) => {
  try {
    readdirSync("./events/").forEach((file) => {
      const events = readdirSync("./events/").filter((file) =>
        file.endsWith(".js")
      );

      for (let file of events) {
        let pull = require(`../events/${file}`);

        if (pull.name) {
          client.events.set(pull.name, pull);
        }
      }
    });
    console.log('events loaded !!')
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
};