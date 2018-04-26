const { RichEmbed } = require('discord.js');
const request = require('snekfetch');
const config = require('../../config');

const handler = async message => {
    if (message.cleanContent === 'souls') {
        const response = await request.get(config.api + '/user/' + message.author.id, { headers: { 'Authorization': config.token }});
        message.channel.send(new RichEmbed({
            title: `${message.author.username}'s soul status`,
            description: `${response.body.balance} souls`
        }));
    }
}

module.exports = handler;