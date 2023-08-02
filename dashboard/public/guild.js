const { PermissionsBitField, ChannelType } = require("discord.js")
const Client = require("../../index").Client
const oauth = require("../../index").oauth
const schema = require("../../Schemas/dashboard")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../../config.json")
const GuildPrefix = require("../../Schemas/GuildPrefix")
const GuildWelcome = require("../../Schemas/Welcome")

module.exports = {
    name: "/guild/:id",
    run: async (req, res) => {
        let { guild, member, data } = await verify(req, res)

        const bitPermissions = new PermissionsBitField(member.permissions.bitfield)
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.permissions.has(PermissionsBitField.Flags.Administrator) && Client.guilds.cache.get(guild.id).ownerId == data.userID) return res.redirect("/dashboard")
        // Prefix
        if (!Client.prefix) Client.prefix = []
        if (!Client.prefix[guild.id]) {
            let Prefix = await GuildPrefix.findOne({
                GuildId: guild.id
            })
            if (!Prefix) Prefix = {}

            Client.prefix[guild.id] = Prefix.Prefix || "g!"
        }
        guild.prefix = Client.prefix[guild.id]
        // Welcome Channel
        if (!Client.WelcomeChannel) Client.WelcomeChannel = []
        if (!Client.WelcomeChannel[guild.id]) {
            let WelcomeChan = await GuildPrefix.findOne({
                Guild: guild.id
            })
            if (!WelcomeChan) WelcomeChan = {}

            Client.WelcomeChannel[guild.id] = WelcomeChan.Channel || "No selected"
        }
        guild.WelcomeChannel = Client.WelcomeChannel[guild.id]

        let guildArray = []

        const testcoll = Client.guilds.cache.get(guild.id).channels.cache.filter(c => c.isTextBased(true));

        for (const element of testcoll) {
            if (Client.channels.cache.get(element[0]).type !== 0) continue;
            
            guildArray.push(Client.channels.cache.get(element[0]).name);
        }
        // Welcome Message
        if (!Client.WelcomeMsg) Client.WelcomeMsg = []
        if (!Client.WelcomeMsg[guild.id]) {
            let WelcomeMsg = await GuildPrefix.findOne({
                GuildId: guild.id
            })
            if (!WelcomeMsg) WelcomeMsg = {}

            Client.WelcomeMsg[guild.id] = WelcomeMsg.WelcomeMessage || "Hello user and welcome to the server"
        }
        guild.prefix = Client.prefix[guild.id]

        let args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            id: data.user.id,
            guild: guild,
            ChannelList: guildArray,
            updated: false,
            error: false
        }

        res.render("./dashboard/html/guildSettings.ejs", args)
    },

    run2: async (req, res) => {
        if (!req.body || !req.body.prefix) return res.redirect(`/guild/` + req.params.id)

        let { guild, member, data } = await verify(req, res)
        // Settings
        let guildArray = []


        const testcoll = Client.guilds.cache.get(guild.id).channels.cache.filter(c => c.isTextBased(true));

        for (const element of testcoll) {
            if (Client.channels.cache.get(element[0]).type !== 0) continue;
            
            guildArray.push(Client.channels.cache.get(element[0]).name);
        }

        if (!Client.prefix) Client.prefix = []
        if (!Client.WelcomeChannel) Client.WelcomeChannel = []
        if (!Client.WelcomeMsg) Client.WelcomeMsg = []
        if (req.body.prefix === (Client.prefix[guild.id] || "g!")) return res.redirect("/guild/" + req.params.id)
        if (req.body.welmessage === (Client.WelcomeMsg[guild.id] || "Hello user and welcome to the server")) return res.redirect("/guild/" + req.params.id)
        if ((req.body.prefix).length > 5) {
            let args = {
                avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                username: data.user.username,
                id: data.user.id,
                guild: guild,
                ChannelList: guildArray,
                updated: false,
                error: true
            }

            return res.render("./dashboard/html/guildSettings.ejs", args)
        }
        let Data = await GuildPrefix.findOne({
            GuildId: guild.id
        })

        if (!Data) {
            GuildPrefix.create({
                GuildId: guild.id,
                Prefix: req.body.prefix,
                WelcomeChan: req.body.welchannel,
                WelcomeMessage: req.body.welmessage
            })

            guild.prefix = Client.prefix[guild.id] = req.body.prefix
            guild.WelcomeChannel = Client.WelcomeChannel[guild.id] = req.body.welchannel
            guild.WelcomeMsg = Client.WelcomeMsg[guild.id] = req.body.welmessage
        } else {
            Data.Prefix = req.body.prefix
            Data.WelcomeChan = req.body.welchannel
            Data.WelcomeMessage = req.body.welmessage
            await Data.save()

            guild.prefix = Client.prefix[guild.id] = req.body.prefix
            guild.WelcomeChannel = Client.WelcomeChannel[guild.id] = req.body.welchannel
            guild.WelcomeMsg = Client.WelcomeMsg[guild.id] = req.body.welmessage
        }

        let args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            id: data.user.id,
            ChannelList: guildArray,
            guild: guild,
            updated: true,
            error: false
        }

        res.render("./dashboard/html/guildSettings.ejs", args)
    },
}

async function verify(req, res) {
    delete require.cache[require.resolve("../html/dashboard.ejs")]

    if (!req.params.id || !Client.guilds.cache.has(req.params.id)) return res.redirect("/dashboard")

    if (!req.cookies.token) return res.redirect("/login")

    let decoded
    try {
        decoded = jwt.verify(req.cookies.token, jwt_secret)
    } catch (error) {

    }
    if (!decoded) res.redirect("/login")

    let data = await schema.findOne({
        _id: decoded.uuid,
        userID: decoded.userID
    })
    if (!data) res.redirect("/login")

    const guild = Client.guilds.cache.get(req.params.id)
    if (!guild) return res.redirect("/dashboard")
    const member = await guild.members.fetch(data.userID)
    if (!member) return res.redirect("/dashboard")

    return {
        guild: guild,
        member: member,
        data: data
    }
}