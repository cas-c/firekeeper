const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const handler = require('./handlers');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async m => {
    if (m.type !== 'DEFAULT') return; // ignore non-messages
    if (m.author.bot) return; // ignore bot messages
    await handler(m, m.channel.type);
})

client.login(config.discord.auth.token);
