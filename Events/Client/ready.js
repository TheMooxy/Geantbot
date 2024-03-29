const { Client, ActivityType } = require("discord.js")
const mongoose = require('mongoose')
const mongoURL = process.env.database

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`${client.user.tag} is now online`)

        client.user.setPresence({activities: [{name: "dev-0.6.0", type: ActivityType.Playing}]})

        if (!mongoURL) return
        mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        }).then(() => {
            console.log("La database est connecter avec succès")
        }).catch(err => console.log("une erreur s'est produit : \n" + err))
    }
}