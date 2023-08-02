const { Client, Message, EmbedBuilder, Collection } = require("discord.js")
const { defaultprefix } = require("../../config.json");
const ms = require("ms");
const Prefix = require("../../Schemas/GuildPrefix")

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client, Discord) {
        if (!client.prefix) client.prefix = []
        if (!client.prefix[message.guild.id]) {
            let data = await Prefix.findOne({ GuildId: message.guild.id })

            if (!data) return client.prefix[message.guild.id] = "g!"
            if (!data.Prefix) return client.prefix[message.guild.id] = "g!"

            return client.prefix[message.guild.id] = data.Prefix
        }

        const prefix = client.prefix[message.guild.id]

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command = client.legacyCommands.get(commandName)
        client.legacyCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author)
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                message.reply({ content: `❌・You don't have permission` }).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, ms("5s"));
                })
            }
        }

        const { cooldowns } = client
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection())
        }

        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const extimes = timestamps.get(message.author.id) + cooldownAmount
            if (now < extimes) {
                const timeleft = (extimes - now) / 1000
                return message.channel.send({ content: `🕰️・Please wait : ${timeleft.toFixed(1)} seconds` }).then((m) => {
                    setTimeout(() => {
                        m.delete()
                    }, ms("5s"));
                })
            }
        }

        timestamps.set(message.author.id, now)
        setTimeout(() => {
            timestamps.delete(message.author.id)
        }, cooldownAmount);

        try {
            command.execute(message, args, commandName, client, Discord)
        } catch (error) {
            console.log(error)
            message.reply({ content: `${error}` })
        }
    }
}