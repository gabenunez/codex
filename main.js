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

  // Universal Functions

  function sendChannelMessage(message) {
    msg.channel.send(message).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
  }

  function sendErrorMessage(message) {
    msg.reply(message).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
  }

  if(msg.channel.name === 'codex') {

    switch(cmd) {

      case "roll":
        let [amountOfDice, typeOfDie] = args;
        let diceRolls = [], diceMessage = "", diceTotal = 0;

        amountOfDice = Number(amountOfDice);
        typeOfDie = Number(typeOfDie.replace(/\D/g,''));

        // Error catching for text-only entries, amount of dice rolled, and type of dice.
        if(amountOfDice === false || typeOfDie == false) {
          sendErrorMessage('An argument doesn\'t have a number!');
          return;
        } else if (amountOfDice > 100) {
          sendErrorMessage('You can\'t roll a die more than 100 times.');
          return;
        } else if (typeOfDie > 1000) {
          sendErrorMessage('You can\'t roll anything higher than a d1000.');
          return;
        }

        for (let i = 0; i < amountOfDice ; i++) {
          diceRolls.push(Math.floor(Math.random() * typeOfDie) + 1);
        }
        
        diceRolls.forEach((num, index) => {
          diceMessage += `${num}` + (index >= amountOfDice - 1 ? '' : ', ');
          diceTotal += num;
        });

        sendChannelMessage(`**:game_die: Dice Rolled (${amountOfDice} d${typeOfDie}):** \n\n\`${diceMessage}\` \n\nTotal: ${diceTotal}`);

        break;

      case "pong":
        msg.reply('ping');
        break;

/*    case "example":
        let [age, occupation] = args;
        msg.channel.send(`Hello ${msg.author.username}, I see you are ${age} and currently work as an ${occupation}!`);
        break;
*/
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