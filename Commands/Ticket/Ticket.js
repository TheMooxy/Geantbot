const { EmbedBuilder, ChatInputCommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const DB = require("../../Schemas/ticketSetup")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("setup ticket system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName("channel").setDescription("Select a channel for ticket create panel").addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addChannelOption(option => option.setName("category").setDescription("Select Category for ticket creation").addChannelTypes(ChannelType.GuildCategory).setRequired(true))
    .addChannelOption(option => option.setName("transcripts").setDescription("Select the transcripts channels").addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addRoleOption(option => option.setName("handlers").setDescription("Select the ticket handler's role.").setRequired(true))
    .addRoleOption(option => option.setName("everyone").setDescription("Provide the @everyone role, its important").setRequired(true))
    .addStringOption(option => option.setName("description").setDescription("set description").setRequired(true))
    .addStringOption(option => option.setName("button").setDescription("Give your button a name and emoji (separe with ,)").setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options } = interaction

        try {
            const Channel = options.getChannel("channel")
            const Category = options.getChannel("category")
            const Transcripts = options.getChannel("transcripts")
            const Handlers = options.getRole("handlers")
            const Everyone = options.getRole("everyone")

            const Description = options.getString("description")

            const Buttons1 = options.getString("button").split(",")

            const emoji1 = Buttons1[1]

            await DB.findOneAndUpdate({ GuildID: guild.id }, {
                Channel: Channel.id,
                Category: Category.id,
                Transcripts: Transcripts.id,
                Handlers: Handlers.id,
                Everyone: Everyone.id,
                Description: Description.id,
                Buttons: [Buttons1[0]]
            },
            {
                new: true,
                upsert: true,
            })

            const Embed = new EmbedBuilder()
            .setAuthor({
                name: `🎟️・${guild.name} ticket systems`,
                iconURL: guild.iconURL()
            })
            .setDescription(Description)
            .setColor("Green")
            .setFooter({text: `🦆 Made by GeantWorld Inc.`})
            .setTimestamp()
    
            const Buttons = new ActionRowBuilder()
            Buttons.addComponents(
                new ButtonBuilder()
                .setCustomId(Buttons1[0])
                .setLabel(Buttons1[0])
                .setStyle(ButtonStyle.Primary)
                .setEmoji(emoji1)
            )
    
            await guild.channels.cache.get(Channel.id).send({embeds: [Embed], components: [Buttons]})
    
            interaction.reply({content: `✅・Success`, ephemeral: true})    
        } catch (error) {
            console.log(error)
        }
    }
}