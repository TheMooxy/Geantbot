const { Client, MessageContextMenuCommandInteraction, EmbedBuilder, InteractionType, Message, AttachmentBuilder, GuildMember, Embed } = require("discord.js")
const welcome = require("../../Schemas/leave")



module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
    async execute(member, client) {
        const { user, guild } = member

        const Data = await welcome.findOne({Guild: guild.id}).catch(err => {  })
        if (!Data) return


        if (Data.Channel !== null) {
            const Channel = guild.channels.cache.get(Data.Channel)

            if (!Channel) return

            const Embed = new EmbedBuilder()
            .setTitle(`${member.user.username} left the Guild`)
            .setDescription(Data.Messages)
            .setAuthor({name: `We are now ${guild.memberCount}`})
            .setFooter({ text: `🦆 Made by GeantWorld Inc.` })
            .setTimestamp()
            .setColor("Green")
            

            Channel.send({content: `${user}`, embeds: [Embed]})
        }
    }
}