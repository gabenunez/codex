const utf8 = require('utf8');
const windows1252 = require('windows-1252');

module.exports = {
    formatArray: function(arrayList, paragraphs) {
        let embedString = '';

        arrayList.forEach((item, index, array) => {
            // Fixes wrong encoding found in the API (Converts windows1252 to UTF-8)
            item = utf8.decode(windows1252.encode(item));
            // Creates embed string,  Lists: Have Commas, Paragraphs: New Lines
            embedString += `${item}${index !== array.length - 1 ? `${paragraphs ? '\n\n' : ', '}` : ''}`
        });

        return embedString;
    }
  };