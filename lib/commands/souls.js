const { 
    getAndSendSoulBalance,
    getAndSendSoulBalanceToDM
 } = require('../handlers/shared');

const command = message => {
    if (message.channel.id === '439928505816317952') {
        getAndSendSoulBalance(message);
    } else {
        getAndSendSoulBalanceToDM(message);
        message.react('✔');
    }
};

module.exports = command;