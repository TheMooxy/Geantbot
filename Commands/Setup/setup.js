const { EmbedBuilder, ChatInputCommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const VerifyData = require("../../Schemas/Verification")
const welcomeData = require("../../Schemas/Welcome")
const LeaveData = require("../../Schemas/leave")
const lvlDB = require("../../Schemas/LevelUp")
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("setup")
      .setDescription("setup all systems.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand(subcommand =>
        subcommand.setName("verify")
        .setDescription("verify setup")
        .addRoleOption(option => option.setName("role").setDescription("provid a valid role").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("provid a valid channel").setRequired(false))
        .addStringOption(option => option.setName("description").setDescription("provid a description").setRequired(false))
        .addStringOption(option => option.setName("title").setDescription("provid a title").setRequired(false))
        .addStringOption(option => option.setName("btn-message").setDescription("provid a message").setRequired(false)))
      .addSubcommand(subcommand =>
        subcommand.setName("welcome")
        .setDescription("setup the welcome !")
        .addStringOption(option => option.setName("description").setDescription("provid a description").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("provid a valid channel").setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName("leave")
        .setDescription("setup the leave system !")
        .addStringOption(option => option.setName("description").setDescription("provid a description").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("provid a valid channel").setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName("level")
        .setDescription("setup the level system")
        .addChannelOption(option => option.setName("channel").setDescription("provid a valid channel").setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName("panel")
        .setDescription("View the complet panel of setup")),
      /**
       * 
       * @param {ChatInputCommandInteraction} interaction 
       */
    async execute(interaction) {
      await interaction.deferReply({ephemeral: true})
      const { options, guild, channel } = interaction

      const sub = interaction.options.getSubcommand(["admin-role", "verify", "welcome", "leave", "level", "panel", "ignore-anti-link-channel"])
      const WelcomeD = await welcomeData.findOne({Guild: guild.id}).catch(err => { })
      const LeafD = await LeaveData.findOne({Guild: guild.id}).catch(err => { })
      const VeriD = await VerifyData.findOne({Guild: guild.id}).catch(err => { })
      const LevelD = await lvlDB.findOne({Guild: guild.id}).catch(err => { })
      const AdminD = await AdminData.findOne({Guild: guild.id}).catch(err => { })
      
      switch (sub) {
        case "admin-role":
          const roles = interaction.options.getRole("role")
          AdminData.findOne({
            Guild: interaction.guild.id
          }, async (err, data) => {
            if (!data) {
              new AdminData({
                Guild: interaction.guild.id,
                Roles: roles.id
              }).save()
              interaction.editReply({content: "✅・Success, I added <@" + roles + "> to the database !"})
            } else {
              data.Roles = roles.id
              await data.save()
              interaction.editReply({content: `✅・I replaced the old by ${roles}`})
            }
          })
          break;
        case "ignore-anti-link-channel":
          const channelIngore = interaction.options.getString("channels")
          const seprareChannel = channelIngore.split(",")
          
          IngoreChannelDB.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if (!data) {
              new IngoreChannelDB({
                Guild: interaction.guild.id,
                Channels: seprareChannel
              }).save()

              interaction.editReply({content: `✅・I added the channels in the database !`})
            } else {
              data.Channels = seprareChannel
              await data.save()
              interaction.editReply({content: `✅・I have deleted old data and replace by the newest (learn more with the docs : https://docs.geantbot.tk)`})
            }
          })
        break
        case "verify": 
          const role = options.getRole("role")
          const Channel = options.getChannel("channel") || channel
          let message = interaction.options.getString('description')
          let title = interaction.options.getString('title')
          let Btn = interaction.options.getString('button-message')

          let VerifData = await VerifyData.findOne({ Guild: guild.id }).catch(err => { })

          if(!VerifData) {
            VerifData = new VerifyData({
                Guild: guild.id,
                Role: role.id,
                BtnMessage: Btn,
                Description: message,
                Title: title
            })

            await VerifData.save()
          } else {
            VerifData.Role = role.id
            await VerifData.save()
          }

          Channel.send({
            embeds: [
              new EmbedBuilder()
              .setTitle(title || "Verification")
              .setColor("DarkGrey")
              .setDescription(message || "❗・Click on the button to verify")
              .setFooter({text: `🦆 Made by GeantWorld Inc.`})
              .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(

                  new ButtonBuilder()
                  .setCustomId("verify")
                  .setLabel(Btn || "Verify")
                  .setStyle(ButtonStyle.Success)
              )
            ]
        })

        interaction.editReply({content: "✅・Success, Verify System is ready !"})
        break;
        case "welcome": 
          const WChannel = options.getChannel("channel")
          const desc = options.getString("description")

          welcomeData.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if(data) data.delete()
            new welcomeData({
                Guild: interaction.guild.id,
                Channel: WChannel.id,
                Messages: desc,
            }).save()

            interaction.editReply({content: "✅・Success, Welcome channel is ready !"})
          })
        break;
        case "leave":
          const LChannel = options.getChannel("channel")
          const Desc = options.getString("description")

          LeaveData.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if(data) data.delete()
            new LeaveData({
                Guild: interaction.guild.id,
                Channel: LChannel.id,
                Messages: Desc,
            }).save()

            interaction.editReply({content: "✅・Success, Leave channel is ready !"})
          })
        break;
        case "level":
          const Lchannel = options.getChannel("channel")

          lvlDB.findOne({
              Guild: interaction.guild.id
          }, async (err, data) => {
              if (data) data.delete()
              new lvlDB({
                  Guild: interaction.guild.id,
                  Channel: Lchannel.id
              }).save()
              interaction.editReply({content: `✅・I have set the channel to ${Lchannel} for level`})
          })
        break;
        case "panel":

          const embed = new EmbedBuilder()
          .setTitle("Setup Panel")
          .setDescription("**Coming soon**")
          .setFooter({text: `🦆 Made by GeantWorld Inc.`})
          .setTimestamp()

          interaction.editReply({embeds: [embed]})
        break;
        default:
          break;
      }
    },
  };