const Discord = require("discord.js");
const fetch = require('node-fetch');
const client = new Discord.Client();
client.db = require("quick.db");
client.config = require("./config.js");

client.on("ready", () => {
  console.log("I'm ready!");
  onStart();
  checkYoutubeChannels();
});

function onStart() {
  // Add new youtube channels to database
  client.config.youtube_channels.forEach((channel) => {
    if (client.db.fetch(channel) === null) client.db.set(channel, false);
  });
}

function checkYoutubeChannels() {
  setInterval(() => {
    // Check if YouTube channels are streaming
    client.config.youtube_channels.forEach((channel) => {
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
          const discordChannel = client.channels.cache.find(c => c.name === client.config.discordChannel);
          if (!discordChannel) return;
          const message = client.config.messageTemplate
          .replace(/{author}/g, channel)
          .replace(/{url}/g, `https://www.youtube.com/c/${channel}/live`);
          discordChannel.send(message);

          client.db.set(channel, true);
        } else if (!isStreaming) client.db.set(channel, false);
      });
    });
  }, client.config.watchInterval);
}

client.login(client.config.token);
