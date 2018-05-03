const { 
    giveMoney
 } = require('../handlers/shared');

const command = async (message, target, amount) => {
    if (!target) {
        message.react('❌');
        return;
    }
    const targetString = target.nickname || target.user.username;
    if (!Boolean(amount) || amount < 1) {
        message.react('❌');
        return;
    }
    const response = await giveMoney(message, target, amount);
    if (response.body.success) {
        message.react(`✔`);
    } else {
        message.react('❌');
    }
};

module.exports = command;