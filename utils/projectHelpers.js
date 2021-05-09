const db = require("../models");


const findProjectToEdit = (rb) => {
    //  input: object that has key 'project_id'
    // action: find the project for the id 
    // return: the project object
    return new Promise((resolve, reject) => {
        db.Project.findById(rb.project_id)
            .then(p => resolve(p))
            .catch(() => reject({ admin: null }))
    })
}


const findProjectKeysToUpdate = (rb) => {
    // find keys attached to req.body and update project with the new values
    const projectObj = { lastEdited: Date() }
    if (rb.title) projectObj.title = rb.title
    if (rb.public) projectObj.public = rb.public
    if (rb.gitHubRepo) projectObj.gitHubRepo = rb.gitHubRepo
    if (rb.description) projectObj.description = rb.description
    return projectObj
}

const updateProjectData = (rb) => {
    // input 1: object that has key 'user_id'.
    // input 2: object containing query instructions
    //  action: find the user matching 'user_id', update user with instructions
    //  return: updated user object
    return new Promise((resolve, reject) => {
        const updatedProjectObj = findProjectKeysToUpdate(rb)
        db.Project.findByIdAndUpdate(rb.project_id, updatedProjectObj, { new: true })
            .populate("entries")
            .then(data => resolve(data))
            .catch(() => reject(null))
    })
}

const addEntryToProject = (rb, entryId) => {
    return new Promise((resolve, reject) => {
        db.Project.findByIdAndUpdate(
            rb.project_id,
            { $addToSet: { entries: entryId } },
            { new: true }
        )
            .populate("entries")
            .then(data => resolve(data))
            .catch(() => reject(null))
    })
}

const deleteProject = (rb) => {
    //  input: object that has key 'project_id'
    // action: find the project matching 'project_id'
    // return: true or false
    return new Promise((resolve, reject) => {
        db.Project.findByIdAndDelete(rb.project_id)
            .then(() => resolve(true))
            .catch(() => reject(null))
    })
}

module.exports = {
    findProjectToEdit,
    findProjectKeysToUpdate,
    updateProjectData,
    addEntryToProject,
    deleteProject
}