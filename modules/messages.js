module.exports = {

    sendChannelMessage: (msg, message) => {
        msg.channel.send(message).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
    },

    sendErrorMessage: (msg, message) => {
        msg.reply(message).then(message => console.log(`Error: ${message.content}`)).catch(console.error);
    },

    logSuccess: (message) => {
        console.log(`Success: ${message}`);
    }
};