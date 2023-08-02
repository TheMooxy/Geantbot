const { EmbedBuilder, Client, Message } = require("discord.js")
const { connection } = require("mongoose")

module.exports = {
    name: "status",
    aliases: ["ping"],
    description: "Sends the client's ping",
    cooldown: 5,
    /**
    * @param {Client} client
    * @param {Message} message
    */
    execute(message, args, commandName, client, Discord) {
        const embed = new EmbedBuilder()
        .setTitle("Here is my stats")
        .setDescription("Bots stats")
        .addFields(
            {
                name: "Discord Api latency",
                value: `${client.ws.ping} ms`,
                inline: true
            },
        )
        .addFields(
            {
                name: "Database",
                value: `\`${switchTo(connection.readyState)}\``,
                inline: true,
            },
            {
                name: "uptime",
                value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                inline: true
            }
        )
        .addFields(
            {
                name: "Ip",
                value: "host ip",
                inline: true
            }
        )
        .setColor("Blue")


        function switchTo(val) {
            var status = " ";
            switch(val) {
                case 0: status = `🔴 Disconnected`
                break;
                case 1: status = `🟢 connected`
                break;
                case 2: status = `🟠 Conneting...`
                break;
                case 3: status = `🟣 Déconnexion en cours`
                break;
            }
            return status
        }

        message.reply({ embeds: [embed] })
    }
}