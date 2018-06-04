const Discord = require('discord.js');
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// https://discordjs.guide/#/command-handling/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity('Dungeons & Dragons', { type: 'PLAYING' });
});

client.on('message', msg => {
  // Checks for prefix and if the message author is a bot.
  if(!msg.content.startsWith(config.prefix) || msg.author.bot) return;

  // Creates arguments by slicking em up, trimming (removing spaces), then getting em into an array.
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);

  // Removes first item from the array and Returns the item as the command.
  const cmd = args.shift().toLowerCase();

  const messages = require('./modules/messages.js');
  if(msg.channel.name === 'codex') {
    if (!client.commands.has(cmd)) return;
    try {
        client.commands.get(cmd).execute(msg, args);
    }
    catch (error) {
      messages.sendErrorMessage(error + "error");
    }
  }

  if(msg.channel.type === 'dm') {
    msg.reply('Please don\'t private message me. Ask me in the #books channel!');
  }
});

client.login(config.bot_token);