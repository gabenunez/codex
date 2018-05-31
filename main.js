const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "$";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity('Dungeons & Dragons', { type: 'PLAYING' });
});

client.on('message', msg => {

  // Checks for prefix and if the message author is a bot.
  if(!msg.content.startsWith(prefix) || msg.author.bot) return;
  }
});

client.login(config.bot_token);

/*
    Give book suggestion based on provided genre

    Steps:
    1. Provide random book w/ book cover, title, rating, and summary
    2. Emojis attached to it with a down and up arrow to move to the next book and keep the book.
    3. If the user presses the thumbs up emoji, keep the book and end the session, otherwise, move to next book or end session based on time.
*/