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

  // Creates arguments by slicking em up, trimming (removing spaces), then getting em into an array.
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);

  // Removes first item from the array and Returns the item as the command.
  const cmd = args.shift().toLowerCase();

  if(msg.channel.name === 'books') {

    switch(cmd) {

      case "ping":
        msg.reply('pong');
        break;

      case "pong":
        msg.reply('ping');
        break;

    }
  }

  if(msg.channel.type === 'dm') {
    msg.reply('Please don\'t private message me. Ask me in the #books channel!');
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