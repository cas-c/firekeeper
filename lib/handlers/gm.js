const tsubaki = require('tsubaki');
const redis = require('redis');
const client = redis.createClient();
const asGet = tsubaki.promisify(client.get).bind(client);
const asSet = tsubaki.promisify(client.set).bind(client);

const config = require('../../config');

const { getAndSendSoulBalanceToDM, getAndSendLeaderboard, giveMoney } = require('./shared');

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

    soulsTracker(message);

    // additional message handling goes here
    const clean = message.cleanContent.toLowerCase();
    const mention = '@firekeeper ';
    if (clean.startsWith(mention)) {
        const command = clean.split(mention)[1];
        if (command.startsWith('souls')) {
            getAndSendSoulBalanceToDM(message);
        } else if (command.startsWith('leaderboard')) {
            getAndSendLeaderboard(message);
        } else if (command.startsWith('give')) {
            const target = message.mentions.members.find(u => u.id !== message.client.user.id && u.id !== message.author.id);
            if (!target) {
                message.react('❌');
                return;
            }
            const targetString = target.nickname || target.user.username;
            const amount = parseInt(command.split(`give @${targetString.toLowerCase()} `)[1]);
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
        }
    }
}

module.exports = handler;