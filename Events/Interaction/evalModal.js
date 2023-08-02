const { Client, CommandInteraction, InteractionType, MessageComponentInteraction, EmbedBuilder, ModalSubmitInteraction } = require("discord.js")
const { ApplicationCommand } = InteractionType
const beautify = require("js-beautify");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId == "evalModal") {

            const code = interaction.fields.getTextInputValue('codeInput');
            const result = new Promise((resolve) => resolve(eval(code)));

            result.then((output) => {
                if (typeof output !== "string") output = require("util").inspect(output, { depth: 0 });

                if (output.includes(client.token)) output = output.replace(client.token, "\"No Token?\"");

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Evaluation success")
                            .setDescription("✅ | Code successfully evaluated!")
                            .addFields(
                                {
                                    name: "Output",
                                    value: `\`\`\`js\n${beautify(output, { format: "js" }).slice(0, 1014)}\n\`\`\``
                                },
                                {
                                    name: "Input",
                                    value: `\`\`\`js\n${beautify(code, { format: "js" }).slice(0, 1014)}\n\`\`\``
                                }
                            )
                            .setFooter({ text: `🦆 Made by GeantWorld Inc.` })
                            .setTimestamp()
                            .setColor("Green")
                    ]
                });
            }).catch((error) => {
                error = error.toString();

                if (error.includes(client.token)) error = error.replace(client.token, "\"No Token?\"");

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Evaluation error")
                            .setDescription("❌ | An error occured!")
                            .addFields(
                                {
                                    name: "Error",
                                    value: `\`\`\`js\n${beautify(error, { format: "bash" }).slice(0, 1014)}\n\`\`\``
                                },
                                {
                                    name: "Input",
                                    value: `\`\`\`js\n${beautify(code, { format: "js" }).slice(0, 1014)}\n\`\`\``
                                }
                            )
                            .setFooter({ text: `🦆 Made by GeantWorld Inc.` })
                            .setTimestamp()
                            .setColor("Red")
                    ]
                });
            })
        } else return;
    }
}