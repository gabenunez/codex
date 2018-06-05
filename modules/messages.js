module.exports = function(msg) {
    // https://stackoverflow.com/a/13163075

    let module = {};

    module.sendChannelMessage = (message) => {
        msg.channel.send(message).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
    };

    module.sendErrorMessage = (message) => {
        msg.reply(message).then(message => console.log(`Error: ${message.content}`)).catch(console.error);
    };

    module.logSuccess = (message) => {
        console.log(`Success: ${message}`);
    };

    module.logError = (message) => {
        console.log(`Error: ${message}`);
    };

    return module;
};