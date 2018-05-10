const { RichEmbed } = require('discord.js');
const request = require('snekfetch');
const config = require('../../config');
const Chance = require('chance');
const chance = new Chance();


const makeGamble = async (message, newBalance, wagered) => {
    return await request.post(config.api + '/gamble', { headers: { 'Authorization': config.token }})
        .send({
            gamblerTag: message.author.tag,
            gamblerId: message.author.id,
            balance: newBalance,
            wagered
        });
}

const generateResultString = (playerRoll, wins, wagered, oneHundred) => {
    if (playerRoll === 100) {
        return {
            text: 'Fortune smiles upon you.',
            winnings: wagered * 3
        };
    }
    if (playerRoll <= 1) {
        if (oneHundred) {
            return {
                text: 'YOU FUCKING DIED',
                winnings: -Infinity
            }
        }
        return {
            text: 'YOU DIED',
            winnings: 0
        }
    }
    if (wins === 0) {
        return {
            text: 'Unfortunately, you have lost the souls you wagered.',
            winnings: -wagered
        }
    } else if (wins === 1) {
        return {
            text: 'You outrolled me one time. \nYou may keep your souls, but you did not win any.',
            winnings: 0
        }
    } else if (wins === 2) {
        return {
            text: `You rolled higher than me twice.  You have won ${Math.floor(wagered * 0.5)} souls.`,
            winnings: wagered * 0.5
        }
    } else if (wins === 3) {
        return {
            text: 'You have beaten me on each roll. \nYou have doubled what you wagered.',
            winnings: wagered * 2
        }
    }
}

const command = async (message, amount) => {
    const tax = 50;
    const wagered = parseInt(amount) - tax;
    if (!wagered || wagered < 450) {
        message.react('❌');
        return;
    }
    const response = await request.get(config.api + '/user/' + message.author.id, { headers: { 'Authorization': config.token }});
    const currentBalance = response.body.balance;
    if (!currentBalance || currentBalance < parseInt(amount)) {
        message.react('❌');
        return;
    }
    const playerRoll = chance.d100();
    const rolls = [chance.natural({ min: 1, max: 100 }), chance.natural({ min: 15, max: 100 }), chance.natural({ min: 30, max: 100 })];
    const wins = rolls.reduce((a, c) => c < playerRoll ? a += 1 : a, 0);
    const result = generateResultString(playerRoll, wins, wagered, rolls.some(r => r === 100));
    let newBalance = currentBalance + result.winnings;
    let winnings = result.winnings;
    if (newBalance < 0) { newBalance = 0 };
    try {
        await makeGamble(message, newBalance, wagered);
        message.channel.send(`${message.author} is gambling ${wagered} souls.`,
            new RichEmbed({
                description: `:game_die: ${message.author} rolled **${playerRoll}**.`,
                fields: [
                    { name: 'Roll 1', value: rolls[0], inline: true },
                    { name: 'Roll 2', value: rolls[1], inline: true },
                    { name: 'Roll 3', value: rolls[2], inline: true },
                    {
                        name: 'Results...',
                        value: result.text + (newBalance > 0 ? '\nA flat fee of 50 souls was applied to this transaction.' : '')
                    },
                    {
                        name: 'Balance',
                        value: `${newBalance} (${winnings >= 0 ? '+' : ''}${winnings})`
                    }
                ]
            })
        );
    } catch(error) {
        console.log(error);
        message.react('❌');
        return;
    }
};

module.exports = command;