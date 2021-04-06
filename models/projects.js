const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    admin: { // owner of the project
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // team: [{ // team members added by admin
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    name: { type: String },
    privacy: {
        friends: { type: Boolean },
        public: { type: Boolean },
    },
    gitHubRepo: { type: String },
    description: { type: String },
    entries: { // entries for each project
        type: Array,
        default: []
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

const Projects = mongoose.model("Projects", ProjectSchema)

module.exports = Projects