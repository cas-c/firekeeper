const { getAndSendSoulBalance } = require('./shared');

const handler = async message => {
    if (message.cleanContent === 'souls') {
        getAndSendSoulBalance(message);
    }
}

module.exports = handler;