const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js") 
const { connection } = require("mongoose")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate code (developper only)."),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if (interaction.user.id == "689466766916714532" || interaction.user.id == "712263490576056322") {
            const evalModal = new ModalBuilder()
            .setCustomId("evalModal")
            .setTitle("Evaluation")

            const codeInput = new TextInputBuilder()
            .setCustomId('codeInput')
            .setLabel("Enter the code to evaluate.")
            .setStyle(TextInputStyle.Paragraph)

            const codeInputActionRow = new ActionRowBuilder().addComponents(codeInput);
            
            evalModal.addComponents(codeInputActionRow);

            await interaction.showModal(evalModal);

        } else {
            return interaction.reply({embed: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌・You can't use this command!")
                .setFooter({text: `🦆 Made by GeantWorld Inc.`})
                .setTimestamp()
            ], ephemeral: true});
        }
    }
}