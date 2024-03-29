const rrSchema = require("../../Schemas/ReactionRoles");
const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("reaction role panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options, guildId, guild, channel } = interaction;

        try {
            const data = await rrSchema.findOne({ GuildID: guildId });

            if (!data.roles.length > 0)
                return interaction.reply({ content: "❌・This server does not have any data.", ephemeral: true });

            const panelEmbed = new EmbedBuilder()
                .setDescription("❗・Please select a role below")
                .setColor("Aqua")
                .setFooter({text: `🦆 Made by GeantWorld Inc.`})
                .setTimestamp()

            const options = data.roles.map(x => {
                const role = guild.roles.cache.get(x.roleId);

                return {
                    label: role.name,
                    value: role.id,
                    description: x.roleDescription,
                    emoji: x.roleEmoji || undefined
                };
            });

            const menuComponents = [
                new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('reaction-roles')
                        .setMaxValues(options.length)
                        .addOptions(options),
                ),
            ];

            channel.send({ embeds: [panelEmbed], components: menuComponents });

            return interaction.reply({ content: "✅・Succesfully sent your panel.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}