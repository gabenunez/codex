const config = require("../../config.json");
const embeds = require('../embeds');

const imagesURL = config.imageBaseUrl;

module.exports = (searchItem) => {
    return {
        "embed": {
            "title": searchItem.name,
            "description": `${embeds.formatArray(searchItem.desc, true)} ${searchItem.higher_level ? '\n\nAt Higher Level:\n' +  embeds.formatArray(searchItem.higher_level) + '\n\n' : ''}`,
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
                    "value": `${embeds.formatArray(searchItem.components)} ${searchItem.material ? '(' + searchItem.material + ')'  : ''}`,
                }
            ]
        }
    };
}