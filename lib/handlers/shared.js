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

const getAndSendLeaderboard = async message => {
    const response = await request.get(config.api + '/leaderboard');
    const leaderboard = response.body.map(r => `\`${r.balance.toString().padStart(6, "0")}\` <@${r.discordId}>`);
    message.channel.send(new RichEmbed({
        title: 'Soul Leaderboard',
        description: `${leaderboard.join('\n')}`
    }));
}


module.exports = {
    getAndSendLeaderboard,
    getAndSendSoulBalance,
    getAndSendSoulBalanceToDM
}