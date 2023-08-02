const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const polls = require("../../Schemas/pollDB")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("poll systems")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => option.setName("topic").setDescription("topic of the poll").setRequired(true)),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
       await interaction.reply({ content: `Your poll has been started below`, ephemeral: true })
       const topic = await interaction.options.getString("topic")

       const embed = new EmbedBuilder()
       .setColor("Random")
       .setTitle(`📊・New poll from ${interaction.user.username}!`)
       .setDescription(`> ${topic}`)
       .addFields({ name: "Upvotes", value: "> **No votes**", inline: true })
       .addFields({ name: "Downvotes", value: "> **No votes**", inline: true })
       .addFields({ name: "Status", value: `Ongoing`})
       .setFooter({text: `🦆 Made by GeantWorld Inc.`})
       .setTimestamp()
       const buttons = new ActionRowBuilder()
       .addComponents(

            new ButtonBuilder()
            .setCustomId("up")
            .setLabel("✅")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("down")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("votes")
            .setLabel("Votes")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("end")
            .setLabel("End poll (mod only)")
            .setStyle(ButtonStyle.Danger),

       )

       const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] })
       msg.createMessageComponentCollector()

       await polls.create({
            Msg: msg.id,
            Upvote: 0,
            DownVote: 0,
            UpMembers: [],
            DownMember: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id,
            Status: "Ongoing"
       })
    }
}