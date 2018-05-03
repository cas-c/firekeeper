const config = require('../../config');

const tsubaki = require('tsubaki');
const redis = require('redis');
const client = redis.createClient();
const asGet = tsubaki.promisify(client.get).bind(client);
const asSet = tsubaki.promisify(client.set).bind(client);

const { getAndSendSoulBalance, getAndSendSoulBalanceToDM, getAndSendLeaderboard, giveMoney } = require('./shared');
const { switcher } = require('../utils');
const actions = require('../commands');

const soulsTracker = async message => {
    // main read/write work for souls
    const queue = JSON.parse(await asGet('users-who-need-souls'));
    if (queue.findIndex(q => q.discordId === message.author.id) === -1) {
        await asSet('users-who-need-souls',
            JSON.stringify(queue.concat([
                { discordId: message.author.id, tag: message.author.tag }
            ]))
        );
    }
};

const handler = async message => {
    // ignore non-tracked guilds
    if (message.guild.id !== config.discord.gid) return;

    if (config.env === 'prod') soulsTracker(message);

    // additional message handling goes here
    const mentionsSelf = message.mentions.members.find(u => u.id === message.client.user.id) !== null;
    if (!mentionsSelf) return;
    const target = message.mentions.members.find(u => u.id !== message.client.user.id && u.id !== message.author.id);
    const commands = message.content.replace(/<.*?>/g, '').split(' ').filter(f => f !== '');

    switcher({
        'test': () => message.channel.send('hola'),
        'give': () => target && commands[1] && actions.give(message, target, parseInt(commands[1])),
        'leaderboard': () => actions.leaderboard(message),
        'souls': () => actions.souls(message)
    })()(commands[0]);
}

module.exports = handler;