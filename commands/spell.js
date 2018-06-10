const config = require("../config.json");
const Api = require('../modules/api.js');

module.exports = {
    name: 'spell',
    description: 'Find a spell in the spell book!',
    execute(msg, args) {
        const spell = new Api(msg, args, 'spells');

        spell.getApiData();
    }
}