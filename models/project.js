const mongoose = require("mongoose")
const { Schema } = mongoose

const ProjectSchema = new Schema({
    data: {
        title: { type: String, required: true, },
        gitHubRepo: { type: String },
        description: { type: String },
        public: { type: Boolean },
    },
    admin_id: { // owner of the project
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: [{ // team members added by admin
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    entries: { // entries for each project
        type: Array,
        default: [],
        ref: "Entry"
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

const Project = mongoose.model("Project", ProjectSchema)
module.exports = Project;