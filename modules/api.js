module.exports = (msg) => {
    const config = require("../config.json");
    const rp = require('request-promise');
    const messages = require('./messages')(msg);
    const utf8 = require('utf8');
    const windows1252 = require('windows-1252');

    let module = {};

    module.getApiData = (args, searchCategory) => {
        formatedTerms = "";
        
        // Converts all command arguments to a usable format (i.e. 'this+is+my+command')
        args.forEach( (arg, index, array) => {
            let indivWord = arg.toLowerCase();
            indivWord = indivWord[0].toUpperCase() + indivWord.substr(1);
            
            formatedTerms += `${indivWord}${index !== array.length - 1 ? '+' : ''}`;
        });

        let termSearch = {
            uri: `${config.apiBaseUrl}${searchCategory}/?name=${formatedTerms}`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        
        // API Calls and Logic w/ Promises
        rp(termSearch)
            .then(function (termSearch) {
            if (termSearch.count > 0 && termSearch.results[0].url) {
                messages.logSuccess(`Search URL Found: ${termSearch.results[0].url}`);

                let searchItem = {
                uri: termSearch.results[0].url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true 
                }

                rp(searchItem)
                .then(function (searchItem) {
                    messages.logSuccess(`Found Search Info on ${searchItem.name}`);
                    
                // Processes arrays for the embed. Lists: Have Commas, Paragraphs: New Lines
                convertArrayforEmbed = (arrayList, paragraphs = false) => {
                    let embedString = '';

                    arrayList.forEach((item, index, array) => {
                        // Fixes wrong encoding found in the API (Converts windows1252 to UTF-8)
                        item = utf8.decode(windows1252.encode(item));
                        embedString += `${item}${index !== array.length - 1 ? `${paragraphs ? '\n\n' : ', '}` : ''}`
                    });

                    return embedString;
                };

                let imagesURL = 'https://raw.githubusercontent.com/gabenunez/codex/master/assets/images';

                messages.sendChannelMessage({
                    "embed": {
                        "title": searchItem.name,
                        "description": `${convertArrayforEmbed(searchItem.desc, true)} ${searchItem.higher_level ? '\n\nAt Higher Level:\n' +  convertArrayforEmbed(searchItem.higher_level) + '\n\n' : ''}`,
                        "color": 8598564,
                        "footer": {
                            "icon_url": `${imagesURL}/info.jpg`,
                            "text": `${searchItem.page.toUpperCase()} | D&D info provided by dnd5eapi.co | Images provided by game-icons.net`
                        },
                        "thumbnail": {
                            "url": `${imagesURL}/spells/${searchItem.school.name.toLowerCase()}.png`,
                        },
                        "fields": [{
                                "name": "Level:",
                                "value": `${searchItem.level}`,
                                "inline": true
                            },
                            {
                                "name": "Range:",
                                "value": `${searchItem.range}`,
                                "inline": true
                            },
                            {
                                "name": "Casting Time:",
                                "value": `${searchItem.casting_time}`,
                                "inline": true
                            },
                            {
                                "name": "Duration:",
                                "value": `${searchItem.concentration === 'yes' ? 'Concentration, ' : ''}${searchItem.duration}`,
                                "inline": true
                            },
                            {
                                "name": "Components:",
                                "value": `${convertArrayforEmbed(searchItem.components)} ${searchItem.material ? '(' + searchItem.material + ')'  : ''}`,
                            }
                        ]
                    }
                })
                })
                .catch( (error) => {
                    messages.sendErrorMessage('Wow. Something went wrong... that I\'m not too sure of.').then(messages.logError(error));
                })

            } else {
                messages.sendErrorMessage('Sorry, that search item doesn\'t exist in the 5e SRD or was typed incorrectly.');
            }
            })
            .catch(function (error) {
                messages.sendErrorMessage(error);
            });
    }

    return module;
}