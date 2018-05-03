const { getAndSendSoulBalance, getAndSendLeaderboard } = require('./shared');

const handler = async message => {
    const command = message.cleanContent.toLowerCase();
    if (command === 'souls') {
        getAndSendSoulBalance(message);
    } else if (command === 'leaderboard') {
        getAndSendLeaderboard(message);
    }
}

module.exports = handler;