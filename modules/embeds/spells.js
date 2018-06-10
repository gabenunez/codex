const Api = require('../api');
const imagesURL = 'https://raw.githubusercontent.com/gabenunez/codex/master/assets/images';


module.exports = (searchItem) => {
    // Processes arrays for the embed.
    // TODO: Add automatic recognition support, setting a parameter is barbaric and gross and I should feel bad.
    const convertArrayforEmbed = (arrayList) => {
        let embedString = '';

        arrayList.forEach((item, index, array) => {
            // Fixes wrong encoding found in the API (Converts windows1252 to UTF-8)
            item = utf8.decode(windows1252.encode(item));
            // Creates embed string,  Lists: Have Commas, Paragraphs: New Lines
            embedString += `${item}${index !== array.length - 1 ? `${paragraphs ? '\n\n' : ', '}` : ''}`
        });

        return embedString;
    };

    const embed = {
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
    }

    return embed;
}