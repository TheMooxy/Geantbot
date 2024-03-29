const { Client, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const lvlDB = require("../../Schemas/Level")
const Canvacord = require('canvacord')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Display your level")
    .addUserOption(option => option.setName("user").setDescription("view user rank").setRequired(false)),
     /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
      async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false })

        const { user, guild } = interaction

        const Member = interaction.options.getUser("user") || user;
        const member = guild.members.cache.get(Member.id)

        const Data = await lvlDB.findOne({Guild: guild.id, User: member.id}).catch(err => {  })
        if (!Data) return interaction.editReply({content: `${member.user.tag} has not gained any XP`})


        const required = Data.Level * Data.Level * 100 + 100

        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forceStatic: true }))
        .setBackground("IMAGE", "https://media.discordapp.net/attachments/885258885131296778/1036315264838553620/unknown.png")
        .setCurrentXP(Data.XP)
        .setRequiredXP(required)
        .setRank(1, "Rank", false)
        .setStatus(member.presence.status)
        .setLevel(Data.Level, "Level")
        .setProgressBar("#FFFFFF", "COLOR")
        .setUsername(member.user.username)

        const Card = await rank.build().catch(err => console.log(err))

        const attachment = new AttachmentBuilder(Card, { name: "level.png" })

        const Embed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setTitle(`${member.user.username}'s Level Card`)
        .setImage("attachment://level.png")
        .setFooter({text: `🦆 Made by GeantWorld Inc.`})
        .setTimestamp()

        await interaction.editReply({ embeds: [Embed], files: [attachment] })
    }
}