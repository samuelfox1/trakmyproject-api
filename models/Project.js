const mongoose = require("mongoose")
const { Schema } = mongoose

const ProjectSchema = new Schema({

    title: { type: String, required: true, },
    gitHubRepo: { type: String },
    description: { type: String },
    public: { type: Boolean },

    admin_id: { // owner of the project
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: [{ // team members added by admin
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: { // posts for each project
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
