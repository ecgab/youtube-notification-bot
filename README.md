# Youtube Notification Bot

Simple and easy to use discord bot to notify members whenever YouTube channels are live.

## Packages Used

- **[discord.js](https://npmjs.com/package/discord.js "View on npmjs")**
- **[quick.db](https://npmjs.com/package/quick.db "View on npmjs")**
- **[node-fetch](https://www.npmjs.com/package/node-fetch "View on npmjs")**

## config.js

```js
module.exports = {
    token: "YOUR_DISCORD_BOT_TOKEN", // discord bot token
    discordChannel: "DISCORD_CHANNEL_ID", // discord channel to send message
    messageTemplate: "Hello @everyone, **{author}** just started streaming!\n{url}", // message to send on discord
    youtube_channels: ["@YOUTUBE_CHANNEL_1", "@YOUTUBE_CHANNEL_2"], // YouTube channels
    watchInterval: 30000 // Check every 30 seconds
};
```
