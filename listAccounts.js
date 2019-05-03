const discord = require('discord.js');
const fs = require("fs");
const snekfetch = require("snekfetch");

module.exports = {
    async run(bot, message, args) {
        if (message.author.id !== "478715467947835392" && message.author.id !== "551140429874331669") return message.channel.send("**Unauthorised.**");
        const accountsList = JSON.parse(fs.readFileSync("./items.json", "utf8"));
        if (accountsList.length === 0) {
            const outEmbed = new discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("**We're out of stock, sorry!**")
                .setColor(0xFF0000);
            message.channel.send(outEmbed);
        } else {
            const accounts = accountsList.map(acc => `${acc.key}`).join("\n");
            snekfetch.post("https://hastebin.com/documents").send(accounts).then(accountsKey => {
                accountsKey = accountsKey.body.key;
                const accountsEmbed = new discord.RichEmbed()
                    .setTitle("List of Accounts")
                    .setURL(`https://hastebin.com/${accountsKey}`)
                    .setColor(0x36393E);
                message.channel.send(accountsEmbed);
            });
        }
    },
    aliases: ["accounts", "accs", "accountslist", "accslist"],
    name: "acclist",
    description: "Get a list of all accounts."
};
