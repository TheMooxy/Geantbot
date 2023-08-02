const { Client, CommandInteraction, InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { ApplicationCommand } = InteractionType
const polls = require("../../Schemas/pollDB")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
    */
   async execute(interaction, client) {
        if (!interaction.guild) return;
        if (!interaction.message) return;
        if (!interaction.isButton()) return;

        const data = await polls.findOne({ Guild: interaction.guild.id, Msg: interaction.message.id })
        if (!data) return;
        const msg = await interaction.channel.messages.fetch(data.Msg)

        if (interaction.customId === "up") {
            if (data.UpMembers.includes(interaction.user.id)) return await interaction.reply({ content: `❌・You can't vote because you already sent a vote !`, ephemeral: true })

            let downvotes = data.DownVote
            if (data.DownMember.includes(interaction.user.id)) {
                downvotes = downvotes - 1
            }

            const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: "✅・Upvotes", value: `> **${data.Upvote + 1}** votes`, inline: true }, { name: "❌・Downvotes", value: `> **${downvotes}** votes`, inline: true }, { name: "📊・Status", value: `${data.Status}`})

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

            await interaction.update({ embeds: [newEmbed], components: [buttons] })

            data.Upvote++;

            if (data.DownMember.includes(interaction.user.id)) {
                data.DownVote = data.DownVote - 1
            }

            data.UpMembers.push(interaction.user.id)
            data.DownMember.pull(interaction.user.id)
            data.save()
        }

        if (interaction.customId === "down") {
            if (data.DownMember.includes(interaction.user.id)) return await interaction.reply({ content: `❌・You can't vote because you already sent a vote !`, ephemeral: true })

            let upvotes = data.Upvote
            if (data.UpMembers.includes(interaction.user.id)) {
                upvotes = upvotes - 1
            }

            const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: "✅・Upvotes", value: `> **${upvotes}** votes`, inline: true }, { name: "❌・Downvotes", value: `> **${data.DownVote + 1}** votes`, inline: true }, { name: "📊・Status", value: `${data.Status}`})

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

            await interaction.update({ embeds: [newEmbed], components: [buttons] })

            data.DownVote++;

            if (data.UpMembers.includes(interaction.user.id)) {
                data.Upvote = data.Upvote - 1;
            }

            data.DownMember.push(interaction.user.id)
            data.UpMembers.pull(interaction.user.id)
            data.save()
        }

        if (interaction.customId === "votes") {
            let upvoters = [];
            await data.UpMembers.forEach(async member => {
                upvoters.push(`<@${member}>`)
            })

            let downvoters = [];
            await data.DownMember.forEach(async member => {
                downvoters.push(`<@${member}>`)
            })

            const embed = new EmbedBuilder()
            .setTitle("Poll votes")
            .setColor("Random")
            .addFields({ name: `✅・Upvotes (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0 , 1020) || "No upvoters"} `, inline: true })
            .addFields({ name: `❌・Downvotes (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020)|| "No downvoters"} `, inline: true })
            .addFields({ name: "📊・Status", value: `${data.Status}`})

            await interaction.reply({ embeds: [embed], ephemeral: true })
        }

        if (interaction.customId === "end") {
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {

                const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: "✅・Upvotes", value: `> **${data.Upvote}** votes`, inline: true }, { name: "❌・Downvotes", value: `> **${data.DownVote}** votes`, inline: true }, { name: "📊・Status", value: "Ended"}).setColor("Red")

                await interaction.update({ embeds: [newEmbed], components: [] })
            } else {
                interaction.reply({ content: "❌・You can't interact with this button", ephemeral: true })
            }
        }
    }
}