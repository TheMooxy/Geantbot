const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const lvlDB = require("../../Schemas/Level")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-xp")
    .setDescription("set xp for a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option => option.setName("member").setDescription("select a valid member").setRequired(true))
    .addIntegerOption(option => option.setName("xp").setDescription("the amount to add").setRequired(true)),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        await interaction.deferReply();

        const { guild, options } = interaction

        const member = options.getMember("member")
        const xp = options.getInteger("xp")

        const Data = await lvlDB.find({Guild: guild.id, User: member.id}).catch(err => {  })

        try {
            try {member.send({embed: [new EmbedBuilder().setColor("Green").setDescription(`${interaction.user} set your XP to ${xp} in ${guild.name}`).setFooter({text: `🦆 Made by GeantWorld Inc.`}).setTimestamp()]})} catch (err) {  }
            await lvlDB.updateOne({Guild: guild.id, User: member.id}, {XP: xp})
            interaction.editReply({embed: [new EmbedBuilder().setColor("Green").setDescription(`✅・Success`).setFooter({text: `🦆 Made by GeantWorld Inc.`}).setTimestamp()]})
        } catch (error) {
            console.log(error)
        }
    }
}