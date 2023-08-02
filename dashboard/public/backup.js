const { PermissionsBitField } = require("discord.js")
const Client = require("../../index").Client
const oauth = require("../../index").oauth
const schema = require("../../Schemas/dashboard")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../../config.json")

module.exports = {
    name: "/guildTest/:id",
    run: async (req, res) => {
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
        const guild = Client.guilds.cache.get(req.params.id)
        if (!guild) return res.redirect("/dashboard")
        const member = await guild.members.fetch(data.userID)
        if (!member) return res.redirect("/dashboard")

        const bitPermissions = new PermissionsBitField(member.permissions.bitfield)
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.permissions.has(PermissionsBitField.Flags.Administrator) && Client.guilds.cache.get(guild.id).ownerId == data.userID) return res.redirect("/getUserGuilds")
        res.send(`
        You are viewing ${guild.name}. <br>
        <a href="/dashboard">back</a> <br><br>
        <a href="/">back to home</a> <br><br>
        Your permissions in this guild are : <br><br><br><br>
        ${Object.entries(bitPermissions.serialize()).map(a => a[0] + ' - ' + a[1]).join('<br>')}
        `)
        let args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            id: data.user.id,
        }
    }
}