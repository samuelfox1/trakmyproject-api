const mongoose = require("mongoose")
const { Schema } = mongoose

const EntrySchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    title: { type: String },
    body: { type: String },
    images: {
        type: Array,
        default: []
    },
    // notes: {
    //     type: Array,
    //     default: []
    // },
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
})

const Entry = mongoose.model("Entry", EntrySchema)
module.exports = Entry;