const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    admin: { // owner of the project
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: [{ // team members added by admin
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    entries: { // entries for each project
        type: Array,
        default: []
    }
});

const Projects = mongoose.model("Projects", ProjectSchema)

module.exports = Projects