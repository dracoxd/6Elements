const discord = require("discord.js");
const fs = require("fs");

module.exports = {
    async run(bot, message, args) {
        if (message.author.id !== "541163269512232961" && message.author.id !== "344190206234329088" && message.author.id !== "548844268698206239" && message.author.id !== "505115779948216342") return message.channel.send("**Unauthorised.**");
        if (!args[0] || !args[1]) return message.channel.send("**You need to provide the type and quality [1-5] of account you're adding.**");
        if (parseInt(args[1]) > 5 || parseInt(args[1]) < 1) return message.channel.send(`**The quality you entered [\`${args[1]}\`] is invalid. It must be between 1 and 5.**`);
        const items = JSON.parse(fs.readFileSync("./items.json", "utf8"));
        const keys = JSON.parse(fs.readFileSync("./keys.json", "utf8"));
        const messages = [];
        messages.push(message);
        messages.push(await message.channel.send(`**Please send the \`${args[0]}\` accounts below. Make sure to split the email and password with a \`":"\` and each new account with a new line.**`));
        const collector = new discord.MessageCollector(message.channel, msg => msg.author.id === message.author.id, { maxMatches: 1, max: 100 });
        let collectedAccounts;
        let accounts;
        await collector.once("collect", async function(response) {
            messages.push(response);
            collectedAccounts = response.content;
            collector.stop();
            accounts = collectedAccounts.split("\n");
            let accKey = key();
            accounts.forEach(account => {
                items.push({ key: accKey, account: account, type: args[0].toLowerCase(), quality: parseInt(args[1]) });
                keys.push(accKey);
                accKey = key();
            });
            fs.writeFileSync("./items.json", JSON.stringify(items));
            fs.writeFileSync("./keys.json", JSON.stringify(keys));
            messages.push(await message.channel.send(`**Successfully added \`${accounts.length}\` ${args[0]} account${accounts.length === 1 ? "" : "s"}.**`));
            messages.forEach(m => m.delete());
        });
    },
    aliases: ["restore", "addaccs", "stockup", "add"],
    name: "restock",
    description: "Restock the accounts list."
};

function key() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = [];
    for (let i = 0; i < 32; i++) {
        key.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    };
    return key.join("");
};
