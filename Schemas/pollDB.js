const { model, Schema } = require('mongoose')

module.exports = model("poll", new Schema({
    Guild: String,
    Msg: String,
    UpMembers: Array,
    DownMember: Array,
    Upvote: Number,
    DownVote: Number,
    Owner: String,
    Status: String,
}))