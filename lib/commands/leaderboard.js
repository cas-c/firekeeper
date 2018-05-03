const { 
    getAndSendLeaderboard,
    getAndSendLeaderboardToDM
 } = require('../handlers/shared');

const command = message => {
    if (message.channel.id === '439928505816317952') {
        getAndSendLeaderboard(message);
    } else {
        getAndSendLeaderboardToDM(message);
        message.react('✔');
    }
};

module.exports = command;