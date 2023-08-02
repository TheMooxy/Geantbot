const { Client, MessageContextMenuCommandInteraction, EmbedBuilder, InteractionType, Message, AttachmentBuilder, GuildMember, Embed } = require("discord.js")
const GuildSchema = require("../../Schemas/GuildPrefix")



module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
    async execute(member, client) {
        const { user, guild } = member

        const Data = await GuildSchema.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return


        if (Data.Channel !== null) {
            const Channel = guild.channels.cache.find(c => c.name === `${Data.WelcomeChan}`)
            console.log(Channel)

            if (!Channel) return console.log(`unable to find : ${Channel}`)

            const Embed = new EmbedBuilder()
                .setTitle(`${member.user.username} join the Guild`)
                .setDescription(`${Data.WelcomeMessage}`)
                .setAuthor({ name: `We are now ${guild.memberCount}`, iconURL: member.user.displayAvatarURL() })
                .setFooter({ text: `🦆 Made by GeantWorld Inc.` })
                .setTimestamp()
                .setColor("Green")


            Channel.send({ content: `${user}`, embeds: [Embed] })
        }
    }
}