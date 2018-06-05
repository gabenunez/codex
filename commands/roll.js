module.exports = {
    name: 'roll',
    description: 'Roll a dice!',
    execute(msg, args) {
        const messages = require('../modules/messages.js')(msg);

        let [amountOfDice, typeOfDie, operand, opNumber] = args;
        let diceRolls = [], diceMessage = "", diceTotal = 0, alteredDiceTotal = 0;

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
            
            // Logic for Math operations when the parameters exist.
            if (operand) {
                if( !/\d/.test(opNumber) ) {
                    messages.sendErrorMessage('Looks like your operational number isn\'t actually a number.');
                    return;
                } else {
                    opNumber = Number(opNumber);

                    if (opNumber < 1 || opNumber > 100 ) {
                        messages.sendErrorMessage('You can\'t have an operational number less than 1 or more than 100 or less than 1.');
                        return;
                    }
                }

                switch(operand) {
                    case "+":
                        alteredDiceTotal = diceTotal + opNumber;
                        break;
                    case "-":
                        alteredDiceTotal = diceTotal - opNumber;
                        break;
                    case "*":
                        alteredDiceTotal = diceTotal * opNumber;
                        break;
                    case "/": 
                        messages.sendErrorMessage('Sorry, division (/) is currently not supported.');
                        return;
                    default: 
                        messages.sendErrorMessage('Please enter a usable Math operator (+, -, *).');
                        return;
                }
            }

            messages.sendChannelMessage(`**:game_die: Dice Rolled (${amountOfDice} d${typeOfDie}):** \n\n\`${diceMessage}\` \n\nTotal: ${diceTotal} ${operand ? operand + ' ' + opNumber + ' = **' + alteredDiceTotal + '**' : ""}`);
        }
    },
};