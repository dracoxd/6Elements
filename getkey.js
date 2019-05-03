const discord = require('discord.js');
const ms = require("ms");
const fs = require("fs");

module.exports = {
    async run(bot, message, args) {
        const items = JSON.parse(fs.readFileSync("./items.json"));
        const item = items[Math.floor(Math.random() * items.length)];

        if (message.channel.name !== "【🤖】pre-gen") return message.channel.send(new discord.RichEmbed()
            .setTitle(`Stop!`)
            .setDescription(`**You need to use the correct channel (<#${message.guild.channels.find(channel => channel.name === "【🤖】pre-gen").id}>).**`)
            .setColor(0xff0000));
        if (!message.member.roles.has(message.guild.roles.find(role => role.name === "GenAccess").id)) return message.channel.send(new discord.RichEmbed()
            .setTitle(`Stop!`)
            .setDescription(`**You need to have the "GenAccess" role.**`)
            .setColor(0xff0000));
        if (items.length <= 0) return message.channel.send(new discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("**We're out of stock, sorry!**")
            .setColor(0xFF0000));
        if (!bot.data.has(message.author.id)) bot.data.set(message.author.id, { num: 0 });
        if (10800000 >= Date.now() - bot.data.get(message.author.id).num && Date.now() - bot.data.get(message.author.id).num !== Date.now()) return message.channel.send(new discord.RichEmbed()
            .setTitle(`Stop!`)
            .setDescription(`**You need to wait \`${ms(10800000 - (Date.now() - bot.data.get(message.author.id).num))}\` before using this again.**`)
            .setColor(0xff0000));
        bot.data.set(message.author.id, { num: Date.now() });
        message.channel.send(new discord.RichEmbed()
            .setTitle(`Check your DMs.`)
            .setDescription(`**You were sent a \`${item.type}\` key.**`)
            .setColor(0x36393E));
        message.author.send(new discord.RichEmbed()
            .setTitle(`Here's the info:`)
            .setDescription(`**Type: \`${item.type}\`\nQuality [1-5]: \`${item.quality}\`\nKey: \`${item.key}\`**`)
            .setColor(0x36393E));
    },
    aliases: ["getkey", "freekey", "givekey"],
    name: "key",
    description: "Claim a key from freegen."
};
