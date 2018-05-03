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

    const clean = message.cleanContent.toLowerCase();
    let cleaned = clean.replace(`@${message.client.user.username}`, '');
    const target = message.mentions.members.find(u => u.id !== message.client.user.id && u.id !== message.author.id);
    const hasTarget = target !== null;
    if (hasTarget) cleaned = cleaned.replace(`@${target.user.username}`, '');
    const commands = cleaned.split(' ').filter(c => !c.startsWith('@')).filter(c => c !== '');
    const command = commands[0];
    switcher({
        'test': () => message.channel.send('hola'),
        'give': () => actions.give(message, target, parseInt(commands[1])),
        'leaderboard': () => actions.leaderboard(message),
        'souls': () => actions.souls(message)
    })()(command);
}

module.exports = handler;