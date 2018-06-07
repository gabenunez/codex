const config = require("../config.json");
const rp = require('request-promise');
const utf8 = require('utf8');
const windows1252 = require('windows-1252');

module.exports = {
    name: 'spell',
    description: 'Find a spell in the spell book!',
    execute(msg, args) {
        const messages = require('../modules/messages.js')(msg);

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
                messages.logSuccess(`Spell URL Found: ${spellSearch.results[0].url}`);

                let spell = {
                uri: spellSearch.results[0].url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true 
                }

                rp(spell)
                .then(function (spell) {
                    messages.logSuccess(`Found Spell Info on ${spell.name}`);

                    // Processes arrays for the embed. Lists: Have Commas, Paragraphs: New Lines
                    convertArrayforEmbed = (arrayList, paragraphs = false) => {
                        let embedString = '';

                        arrayList.forEach( (item, index, array) => {
                            // Fixes wrong encoding found in the API (Converts windows1252 to UTF-8)
                            item = utf8.decode(windows1252.encode(item));
                            embedString += `${item}${index !== array.length - 1 ? `${paragraphs ? '\n\n' : ', '}` : ''}`
                        });

                        return embedString;
                    };
                    
                    let imagesURL = 'https://raw.githubusercontent.com/gabenunez/codex/master/assets/images';
                    messages.sendChannelMessage(
                        {
                        "embed": {
                            "title": spell.name,
                            "description": `${convertArrayforEmbed(spell.desc, true)} *(${spell.page.toUpperCase()})*`,
                            "color": 8598564,
                            "footer": {
                            "icon_url": `${imagesURL}/info.jpg`,
                            "text": "D&D info provided by dnd5eapi.co | Images provided by game-icons.net"
                            },
                            "thumbnail": {
                            "url": `${imagesURL}/spells/${spell.school.name.toLowerCase()}.png`,
                            },
                            "fields": [
                                {
                                    "name": "Level:",
                                    "value": `${spell.level}`,
                                },
                                {
                                    "name": "Range:",
                                    "value": `${spell.range}`,
                                },
                                {
                                    "name": "Casting Time:",
                                    "value": `${spell.casting_time}`,
                                },
                                {
                                    "name": "Duration:",
                                    "value": `${spell.concentration === 'yes' ? 'Concentration, ' : ''}${spell.duration}`,
                                },
                                {
                                    "name": "Components:",
                                    "value": `${convertArrayforEmbed(spell.components)} ${spell.material ? '(' + spell.material + ')'  : ''}`,
                                },
                            ]
                        }
                        }
                    )
                })
                .catch(function (error) {
                    messages.sendErrorMessage('Wow. Something went wrong... that I\'m not too sure of.');
                })

            } else {
                messages.sendErrorMessage('Sorry, that spell doesn\'t exist in the 5e SRD or was typed incorrectly.');
            }
            })
            .catch(function (error) {
                messages.sendErrorMessage(error);
            });
    },
};