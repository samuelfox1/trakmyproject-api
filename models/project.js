const mongoose = require("mongoose")
const { Schema } = mongoose

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    admin: { // owner of the project
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // team: [{ // team members added by admin
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    public: { type: Boolean },
    gitHubRepo: { type: String },
    description: { type: String },
    entries: { // entries for each project
        type: Array,
        default: []
    },
    // comments: {
    //     type: Array,
    //     default: []
    // },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastEdited: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model("Project", ProjectSchema)
module.exports = Project;