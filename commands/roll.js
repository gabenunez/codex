module.exports = {
    name: 'roll',
    description: 'Roll a dice!',
    execute(msg, args) {
        const messages = require('../modules/messages.js')(msg);

        // TODO: Need to add the ability to "add" or "subtract". i.e: 4d6 +4
        let [amountOfDice, typeOfDie] = args;
        let diceRolls = [], diceMessage = "", diceTotal = 0;

        // Check if both arguments have a number in them.
        if( !/\d/.test(amountOfDice) || !/\d/.test(typeOfDie) ) {
            messages.sendErrorMessage('An argument doesn\'t have a number!');
            return;
        }

        amountOfDice = Number(amountOfDice);
        typeOfDie = Number(typeOfDie.replace(/\D/g,''));

        // Rules and logic of dice rollin'

        if (amountOfDice < 1 || amountOfDice > 100) {
            messages.sendErrorMessage('You can\'t roll a die less than 1 or more than 100 times.');
        } else if (typeOfDie < 2 || typeOfDie > 1000) {
            messages.sendErrorMessage('You can\'t roll a die with less than 2 or more than 1000 sides.');
        } else {
            for (let i = 0; i < amountOfDice ; i++) {
                diceRolls.push(Math.floor(Math.random() * typeOfDie) + 1);
            }
                
            diceRolls.forEach((num, index) => {
            diceMessage += `${num} ${index >= amountOfDice - 1 ? '' : ', '}`;
            diceTotal += num;
            });
    
            messages.sendChannelMessage(`**:game_die: Dice Rolled (${amountOfDice} d${typeOfDie}):** \n\n\`${diceMessage}\` \n\nTotal: ${diceTotal}`);
        }
    },
};