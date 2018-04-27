const { getAndSendSoulBalance } = require('./shared');

const handler = async message => {
    if (message.cleanContent.toLowerCase() === 'souls') {
        getAndSendSoulBalance(message);
    }
}

module.exports = handler;