const discord = require('discord.js');

module.exports = {
    async run(bot, message, args) {
        const commands = bot.baseCommands.map(c => `**${c.name}** : *${c.description}*${c.aliases ? `\nAliases: **${c.aliases.join(", ")}**` : ""}\n`)
        const commandsEmbed = new discord.RichEmbed()
            .setTitle("List of Commands:")
            .setDescription(commands)
            .setColor(0x36393E);
        message.channel.send(commandsEmbed);
    },
    aliases: ["halp", "cmds", "commands"],
    name: "help",
    description: "Find out how to use the bot."
};