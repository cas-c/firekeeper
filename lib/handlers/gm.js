const tsubaki = require('tsubaki');
const redis = require('redis');
const client = redis.createClient();
const asGet = tsubaki.promisify(client.get).bind(client);
const asSet = tsubaki.promisify(client.set).bind(client);

const config = require('../../config');

const { getAndSendSoulBalanceToDM } = require('./shared');

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

    if (message.cleanContent === '@firekeeper souls') {
        getAndSendSoulBalanceToDM(message);
    }
}

module.exports = handler;