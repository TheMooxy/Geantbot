const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

interaction.reply({content: "ah shit bro, here we go again", components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("hi").setLabel("bouncing balls").SetStyle(ButtonStyle.Danger))]})