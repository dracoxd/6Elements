const discord = require("discord.js");
const request = require("request");
const ms = require("ms");
const fs = require("fs");
const moment = require("moment");
const chalk = require("chalk");
const config = require("./config.json");
const token = config.token;
const log = message => {
    console.log(`[${moment().format('DD/MM/YY HH:mm:ss')}] ${message}`);
};

const bot = new discord.Client({
    disableEveryone: false,
    fetchAllMembers: true
});
bot.commands = new discord.Collection();
bot.baseCommands = new discord.Collection();
bot.data = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) return log(err);
    let commandFiles = files.filter(f => f.endsWith(".js"));
    log(chalk.bgBlack(chalk.bold.magenta(`Loading ${commandFiles.length} commands.`)));
    if (commandFiles.length <= 0) {
        log(chalk.bgBlack(chalk.bold.magenta(`Couldn't find commands.`)));
        return;
    };

    commandFiles.forEach(cmdFile => {
        const command = require(`./commands/${cmdFile}`);
        cmdFile = cmdFile.replace(".js", "");
        log(chalk.bgBlack(chalk.magenta.bold(`Command ${cmdFile} loaded.`)));
        bot.commands.set(command.name, command);
        bot.baseCommands.set(command.name, command);
        command.aliases.forEach(alias => bot.commands.set(alias, command));
    });
});

bot.on("message", function(message) {
    if(message.channel.type === "dm") return;
    const content = message.content.split(" ");
    const command = content[0];
    const args = content.slice(1);
    const prefix = config.prefix;
    if (message.content.startsWith(prefix)) {
        let commandfile = bot.commands.get(command.slice(prefix.length).toLowerCase());
        if (commandfile) {
            commandfile.run(bot, message, args);
        } else {
            let notfoundembed = new discord.RichEmbed()
                .setTitle("**Command not Found!**")
                .setColor(0x36393E)
                .setDescription(`Please type \`${prefix}help\` to get a list of all of the available commands!`)
                .setFooter(`Input: ${content.join(" ")}`)
            message.channel.send(notfoundembed);
        }
    }
})

bot.on("debug", function(message) {
    log(chalk.bgBlack(chalk.yellow(message)));
});

bot.on("warning", function(message) {
    log(chalk.bgBlack(chalk.yellow(message)));
});

bot.on("error", function(message) {
    log(chalk.bgBlack(chalk.bold.red(message)));
});

bot.once("ready", function() {
    log(chalk.bgBlack(chalk.green(`Ready. ${bot.members.size} members.`)));
});

try {
    bot.login(token);
} catch (error) {
    log("Invalid token provided.");
};
