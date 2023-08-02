const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits
const express = require("express")
const app = express()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const { loadCommands } = require("./Handlers/commandHandler")
const { loadEvents }  = require("./Handlers/eventHandler")
const { loadLegacyCommands } = require("./Handlers/LegacyCommandHandler")
const { err } = require("./Handlers/error")
require("dotenv").config()
const ms = require("ms")
const fs = require("fs")
const DiscordOauth2 = require("discord-oauth2")
const config = require("./config.json")
const cookieParser = require("cookie-parser")
const urlencodedParser = require("body-parser").urlencoded({ extended: false })

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
  })

app.enable("trust proxy")
app.set("etag", false)
app.use(express.static(__dirname + "/dashboard"))
app.set("views", __dirname)
app.set("view engine", "ejs")
app.use(cookieParser())
app.use(urlencodedParser)
const oauth = new DiscordOauth2({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: `${config.domain}/callback`
})

client.commands = new Collection()
client.legacyCommands = new Collection()
client.cooldowns = new Collection()
module.exports.Client = client
module.exports.oauth = oauth

client.login(process.env.token).then(() => {
    loadEvents(client)
    loadCommands(client)
    loadLegacyCommands(client)
    err(client)
    require("./Systems/GiveawaySystem")(client)
})

// website handler

let files = fs.readdirSync("./dashboard/public").filter(f => f.endsWith(".js"))
files.forEach(f => {
    const file = require(`./dashboard/public/${f}`)
    if (file && file.name) {
        app.get(file.name, file.run)

        if (file.run2) app.post(file.name, file.run2)

        console.log(`[Dashboard] - loaded ${file.name}`)
    }
})

app.listen(5190, () => console.log(`app listen at port : 5190`))