const request = require('snekfetch');
const config = require('../config');

const tsubaki = require('tsubaki');
const redis = require('redis');
const client = redis.createClient();
const asGet = tsubaki.promisify(client.get).bind(client);
const asSet = tsubaki.promisify(client.set).bind(client);

const run = async () => {
    const response = await request.get(config.api + '/user', { headers: { 'Authorization': config.token }});
    const queue = JSON.parse(await asGet('users-who-need-souls'));
    if (!queue) {
        await asSet('users-who-need-souls', '[]');
        return;
    }
    const work = queue.map(q => response.body.find(r => r.discordId === q.discordId) || Object.assign({}, q, { balance: 0 }));
    if (work.length === 0) return;
    const withMoney = work.map(w => Object.assign({}, w, { balance: w.balance + (Math.floor(Math.random() * Math.floor(Math.random() * Math.floor(120) + 1) + 1) * 3) }));
    const postResponse = await request.post(config.api + '/user', { headers: { 'Authorization': config.token }})
        .send(withMoney);
    console.log(postResponse.body);
    await asSet('users-who-need-souls', '[]');
}

run().then(() => process.exit());
