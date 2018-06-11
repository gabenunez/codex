const config = require("../config.json");
const rp = require('request-promise');

class Api {
    constructor(msg, args, searchCategory) {
        this.msg = msg;
        this.args = args;
        this.searchCategory = searchCategory;
    }

    getApiData() {
        const messages = require('./messages')(this.msg);

        let formatedTerms = "";

        // Converts all command arguments to a usable format (i.e. 'this+is+my+command')
        this.args.forEach((arg, index, array) => {
            let indivWord = arg.toLowerCase();
            indivWord = indivWord[0].toUpperCase() + indivWord.substr(1);

            formatedTerms += `${indivWord}${index !== array.length - 1 ? '+' : ''}`;
        });

        let termSearch = {
            uri: `${config.apiBaseUrl}${this.searchCategory}/?name=${formatedTerms}`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        // API Calls and Logic w/ Promises
        rp(termSearch)
            .then(function(termSearch) {
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
                        .then(function(searchItem) {
                            messages.logSuccess(`Found Search Info on ${searchItem.name}`);

                            const createEmbed = require('./embeds/spells');
                            messages.sendChannelMessage(createEmbed(searchItem));
                        })
                        .catch((error) => {
                            messages.sendErrorMessage('Wow. Something went wrong... that I\'m not too sure of.').then(messages.logError(error));
                        })

                } else {
                    messages.sendErrorMessage('Sorry, that search item doesn\'t exist in the 5e SRD or was typed incorrectly.');
                }
            })
            .catch(function(error) {
                messages.sendErrorMessage(error);
            });
    }
}

module.exports = Api;