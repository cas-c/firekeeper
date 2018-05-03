const { RichEmbed } = require('discord.js');
const request = require('snekfetch');
const config = require('../../config');

const sendBalance = async (channel, message) => {
    const response = await request.get(config.api + '/user/' + message.author.id, { headers: { 'Authorization': config.token }});
    channel.send(new RichEmbed({
        title: `${message.author.username}'s soul status`,
        description: `${response.body.balance || 0} souls`
    }));
};

const getAndSendSoulBalance = async message => {
    sendBalance(message.channel, message);
};

const getAndSendSoulBalanceToDM = async message => {
    const dm = await message.author.createDM();
    sendBalance(dm, message);
};

const sendLeaderboard = async (channel, message) => {
    const response = await request.get(config.api + '/leaderboard');
    const leaderboard = response.body.map(r => `\`${r.balance.toString().padStart(6, "0")}\` <@${r.discordId}>`);
    channel.send(new RichEmbed({
        title: 'Soul Leaderboard',
        description: `${leaderboard.join('\n')}`
    }));
};

const getAndSendLeaderboard = async message => {
    sendLeaderboard(message.channel, message);
};

const getAndSendLeaderboardToDM = async message => {
    const dm = await message.author.createDM();
    sendLeaderboard(dm, message);
};

const giveMoney = async (message, target, amount) => {
    return await request.post(config.api + '/transaction', { headers: { 'Authorization': config.token }})
        .send({
            giverId: message.author.id,
            receiverId: target.id,
            amount
        });
}

module.exports = {
    getAndSendLeaderboard,
    getAndSendLeaderboardToDM,
    getAndSendSoulBalance,
    getAndSendSoulBalanceToDM,
    giveMoney
}