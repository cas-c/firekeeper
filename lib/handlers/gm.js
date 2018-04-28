const tsubaki = require('tsubaki');
const redis = require('redis');
const client = redis.createClient();
const asGet = tsubaki.promisify(client.get).bind(client);
const asSet = tsubaki.promisify(client.set).bind(client);

const config = require('../../config');

const { getAndSendSoulBalanceToDM, getAndSendLeaderboard } = require('./shared');

const handler = async message => {
    // ignore non-tracked guilds
    if (message.guild.id !== config.discord.gid) return;

    // main read/write work for souls
    const queue = JSON.parse(await asGet('users-who-need-souls'));
    if (queue.findIndex(q => q.discordId === message.author.id) === -1) {
        await asSet('users-who-need-souls',
            JSON.stringify(queue.concat([
                { discordId: message.author.id, tag: message.author.tag }
            ]))
        );
    }

    // additional message handling goes here
    const clean = message.cleanContent.toLowerCase();
    const mention = '@firekeeper ';
    if (clean.startsWith(mention)) {
        const command = clean.split(mention)[1];
        if (command.startsWith('souls test')) {
            getAndSendSoulBalanceToDM(message);
        } else if (command.startsWith('leaderboard')) {
            getAndSendLeaderboard(message);
        }
    }
}

module.exports = handler;