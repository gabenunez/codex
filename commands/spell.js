const config = require("../config.json");
const rp = require('request-promise');

module.exports = {
    name: 'spell',
    description: 'Find a spell in the spell book!',
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

        formatedSpell = "";
        
        // Converts all command arguments to a usable format (i.e. 'this+is+my+command')
        args.forEach( (arg, index, array) => {
            let indivWord = arg.toLowerCase();
            indivWord = indivWord[0].toUpperCase() + indivWord.substr(1);
            
            formatedSpell += `${indivWord}${index !== array.length - 1 ? '+' : ''}`;
        });

        let spellSearch = {
            uri: `${config.apiBaseUrl}spells/?name=${formatedSpell}`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        
        // API Calls and Logic w/ Promises
        rp(spellSearch)
            .then(function (spellSearch) {
            if (spellSearch.count > 0 && spellSearch.results[0].url) {
                logSuccess(`Spell URL Found: ${spellSearch.results[0].url}`);

                let spell = {
                uri: spellSearch.results[0].url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true 
                }

                rp(spell)
                .then(function (spell) {
                    logSuccess(`Found Spell Info on ${spell.name}`);
                })
                .catch(function (error) {
                    sendErrorMessage('Wow. Something went wrong... that I\'m not too sure of.');
                })

            } else {
                sendErrorMessage('Sorry, that spell doesn\'t exist in the 5e SRD or was typed incorrectly.');
            }
            })
            .catch(function (error) {
                sendErrorMessage(error);
            });
    },
};