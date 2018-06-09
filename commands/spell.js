const config = require("../config.json");
const utf8 = require('utf8');
const windows1252 = require('windows-1252');

module.exports = {
    name: 'spell',
    description: 'Find a spell in the spell book!',
    execute(msg, args) {
        const messages = require('../modules/messages.js')(msg);
        const api = require('../modules/api.js')(msg);

        api.getApiData(args, 'spells');
    }
}