const discord = require("discord.js");
const fs = require("fs");

module.exports = {
    async run(bot, message, args) {
        const items = JSON.parse(fs.readFileSync("./items.json", "utf8"));
        const keys = JSON.parse(fs.readFileSync("./keys.json", "utf8"));

        if (message.channel.name !== "【🤖】pre-gen") return message.channel.send(new discord.RichEmbed()
            .setTitle(`Stop!`)
            .setDescription(`**You need to use the correct channel (<#${message.guild.channels.find(channel => channel.name === "【🤖】pre-gen").id}>).**`)
            .setColor(0xff0000));
        let account;
        const outEmbed = new discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("**We're out of stock, sorry!**")
            .setColor(0xFF0000);
        const invalidEmbed = new discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Invalid key.")
            .setColor(0xFF0000);
        const accountEmbed = new discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Success!")
            .setColor(0x00FF00);
        const checkDMs = new discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Check your DMs.")
            .setColor(0x00FF00);
        const messages = [];
        messages.push(message);
        if (items.length === 0) return message.channel.send(outEmbed);
        let valid = false;
        if (!args[0]) {
            messages.push(await message.channel.send(`**Please send the key below.**`));
            const collector = new discord.MessageCollector(message.channel, msg => msg.author.id === message.author.id, { maxMatches: 1, max: 100 });
            await collector.once("collect", async function(response) {
                collector.stop();
                messages.push(response);
                items.forEach(item => {
                    if (item.key === response.content) {
                        valid = true;
                        account = {
                            email: item.account.split(":")[0],
                            password: item.account.split(":")[1]
                        };
                        accountEmbed.setDescription(`**Key successfully used. Here is your account:**\n\n**Email: **\`${account.email}\`\n**Password: **\`${account.password}\`\n\n**If you have any problems, please contact <@535963700029554688> or <@478715467947835392>.**`);
                        message.author.send(accountEmbed);
                        checkDMs.setDescription(`**You successfully used the key "\`${response.content}\`, and got a \`${item.type}\` account.**`);
                        message.channel.send(checkDMs)
                        items.splice(items.indexOf(item), 1);
                        keys.splice(keys.indexOf(item.key), 1);
                        fs.writeFileSync("./items.json", JSON.stringify(items));
                        fs.writeFileSync("./keys.json", JSON.stringify(keys));
                    };
                });
                if (!valid) {
                    invalidEmbed.setDescription(`**The key that you provided [\`${response.content}\`] is invalid.**`);
                    messages.push(await message.channel.send(invalidEmbed));
                };
            });
        } else {
            items.forEach(async (item) => {
                if (item.key === args[0]) {
                    valid = true;
                    account = {
                        email: item.account.split(":")[0],
                        password: item.account.split(":")[1]
                    };
                    accountEmbed.setDescription(`**Key successfully used. Here is your account:**\n\n**Email: **\`${account.email}\`\n**Password: **\`${account.password}\`\n\n**If you have any problems, please contact <@535963700029554688> or <@478715467947835392>.**`);
                    message.author.send(accountEmbed);
                    checkDMs.setDescription(`**You successfully used the key "\`${args[0]}\`", and got a \`${item.type}\` account.**`);
                    message.channel.send(checkDMs)
                    items.splice(items.indexOf(item), 1);
                    keys.splice(keys.indexOf(item.key), 1);
                    fs.writeFileSync("./items.json", JSON.stringify(items));
                    fs.writeFileSync("./keys.json", JSON.stringify(keys));
                };
            });
            if (!valid) {
                invalidEmbed.setDescription(`**The key that you provided [\`${args[0]}\`] is invalid.**`);
                messages.push(message.channel.send(invalidEmbed));
            };
            messages.forEach(m => m.delete());
        }
    },
    aliases: ["use", "claimkey", "usekey", "redeem", "redeemkey"],
    name: "claim",
    description: "Redeem a key to be given an account for one of many different services."
};
