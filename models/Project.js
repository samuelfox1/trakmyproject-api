const mongoose = require("mongoose")
const { Schema } = mongoose

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    gitHubRepo: {
        type: String
    },
    description: {
        type: String
    },
    public: {
        type: Boolean,
        required: true
    },
    admin_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    posts: {
        type: Array,
        default: [],
        ref: "Post"
    },
    comments: {
        type: Array,
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastEdited: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Project", ProjectSchema)
