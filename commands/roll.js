module.exports = {
    name: 'roll',
    description: 'Roll a dice!',
    execute(msg, args) {

        function sendChannelMessage(message) {
            msg.channel.send(message).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
          }
        
          function sendErrorMessage(message) {
            msg.reply(message).then(message => console.log(`Error: ${message.content}`)).catch(console.error);
          }
        
          function logSuccess(message) {
            console.log(`Success: ${message}`);
          }
        // TODO: Need to add the ability to "add" or "subtract". i.e: 4d6 +4
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
          diceMessage += `${num} ${index >= amountOfDice - 1 ? '' : ', '}`;
          diceTotal += num;
        });

        sendChannelMessage(`**:game_die: Dice Rolled (${amountOfDice} d${typeOfDie}):** \n\n\`${diceMessage}\` \n\nTotal: ${diceTotal}`);
    },
};