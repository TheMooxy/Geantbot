const { model, Schema } = require('mongoose')

module.exports = model("GuildPrefix", new Schema({
    GuildId: {
        type: String,
        required: true
    },
    BLW: {
        type: Array,
        default: []
    },
    Prefix: {
        type: String
    },
    WelcomeChan: {
        type: String
    },
    WelcomeMessage: {
        type: String
    }
}))