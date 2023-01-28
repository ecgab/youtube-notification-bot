const Discord = require("discord.js");
const fetch = require('node-fetch');
const client = new Discord.Client();
client.db = require("quick.db");
client.config = require("./config.js");

client.on("ready", () => {
  console.log("I'm ready!");
  checkYoutubeChannels();
});

function checkYoutubeChannels() {
  setInterval(() => {
    // Check if YouTube channels are streaming
    client.config.youtubeChannels.forEach((channel) => {
      // Add new youtube channels to database
      if (client.db.fetch(channel) === null) client.db.set(channel, false);

      fetch(`https://www.youtube.com/c/${channel}`)
      .then((data) => data.text())
      .then((text) => {
        /* 
         * Very basic way of checking if YouTube channel is live
         * Checks HTML for {"text":" watching"}
         * https://stackoverflow.com/a/56387994
        */
        const isStreaming = text.includes(`{"text":" watching"}`);

        if (isStreaming && !client.db.fetch(channel)) {
          // Find Discord channel to post message in
          const discordChannel = client.channels.cache.get(client.config.discordChannelId);
          if (!discordChannel) return;
          const message = client.config.messageTemplate
          .replace(/{author}/g, channel.slice(1))
          .replace(/{url}/g, `https://www.youtube.com/c/${channel}/live`);
          discordChannel.send(message);
          console.log('Message sent.', client.db.fetch(channel));

          client.db.set(channel, true);
        } else if (!isStreaming) client.db.set(channel, false);
      });
    });
  }, client.config.watchInterval);
}

client.login(client.config.token);
