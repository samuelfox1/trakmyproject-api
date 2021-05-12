const db = require("../models");
const mongoose = require("mongoose");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)
const message = 'invalid project_id'

const createProject = (resolve, reject, rb) => {
    db.Project.create(rb)
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const findProject = (resolve, reject, rb) => {
    if (!isValidId(rb.project_id)) reject(message)
    db.Project.findById(rb.project_id)
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const updateProject = (resolve, reject, rb) => {
    if (!isValidId(rb.project_id)) reject(message)
    db.Project.findByIdAndUpdate(rb.project_id, { data: rb.data }, { new: true })
        .populate("entries")
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const deleteProject = (resolve, reject, rb) => {
    if (!isValidId(rb.project_id)) reject(message)
    db.Project.findByIdAndDelete(rb.project_id)
        .then(data => resolve(data))
        .catch(err => reject(err))
}

// const addEntryToProject = (rb, entryId) => {
//     return new Promise((resolve, reject) => {
//         db.Project.findByIdAndUpdate(
//             rb.project_id,
//             { $addToSet: { entries: entryId } },
//             { new: true }
//         )
//             .populate("entries")
//             .then(data => resolve(data))
//             .catch(err => reject(err))
//     })
// }

module.exports = {
    createProject,
    findProject,
    updateProject,
    deleteProject
}