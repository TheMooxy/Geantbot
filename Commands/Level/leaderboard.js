const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const lvlDB = require("../../Schemas/Level")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Display the leaderboard"),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false })

        const { guild } = interaction

        let usernameLeaderboard = "";
        let xpLeaderboard = "";
        let LevelLeaderboard = "";
        let embedLeaderboard = new EmbedBuilder();

        const Data = await lvlDB.find({Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(10)
            .catch(err => {  })

            if(!Data) return interaction.reply({content: `No one's at the leaderboard`})


            for (let counter = 0; counter < Data.length; ++counter) {

                const { User, XP, Level } = Data[counter];

                const Member = guild.members.cache.get(User);

                if(Member) usernameLeaderboard = Member.user.username;
                else usernameLeaderboard = "Unknown";

                xpLeaderboard = shorten(XP);

                LevelLeaderboard = Level;
                
                embedLeaderboard
                .setColor("Blue")
                .setTitle("✨・Leaderboard")
                .addFields(
                    {
                        name: `${counter+1}. ${usernameLeaderboard}`, value: `📊・Level: ${LevelLeaderboard}\n⭐・XP: ${xpLeaderboard}`,
                    }
                )
                .setFooter({text: `🦆 Made by GeantWorld Inc.`})
                .setTimestamp()
                
            }

            await interaction.editReply({ embeds: [
                embedLeaderboard
            ]});
    }
}

function shorten(count) {
    const ABBRS = ["", "K", "M", "T"]

    const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000))

    let result = parseFloat((count / Math.pow(1000, i)).toFixed(2))
    result += `${ABBRS[i]}`

    return result
}