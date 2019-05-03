const discord = require('discord.js');
const fs = require("fs");

module.exports = {
    async run(bot, message, args) {
        const keys = JSON.parse(fs.readFileSync("./keys.json", "utf8"));
        if (message.channel.name !== "generator") return message.channel.send(new discord.RichEmbed()
            .setTitle(`Stop!`)
            .setDescription(`**You need to use the correct channel (<#${message.guild.channels.find(channel => channel.name === "generator").id}>).**`)
            .setColor(0xff0000));
        const stockEmbed = new discord.RichEmbed()
            .setDescription(`**We currently have \`${keys.length === 0 ? "no" : keys.length}\` accounts in stock.**`)
            .setColor(keys.length > 30 ? 0x00FF00 : keys.length > 15 ? 0xFFA500 : keys.length > 0 ? 0xFF0000 : 0x36393E);
        message.channel.send(stockEmbed);
    },
    aliases: ["stockAmount", "stockCount", "accounts"],
    name: "stock",
    description: "Find out how many accounts we have in stock."
};
