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

const getUsersUpdatedProjectsArr = (rb) => {
    //  input: object that has key 'user_id' & 'project_id'
    // action: find the user object for the user_id
    // return: an array of all project excluding the 'project_id' from input
    return new Promise((resolve, reject) => {
        db.User.findById(rb.user_id)
            .then(u => {
                const updatedProjectsArray = u.projects.filter(p => p._id != rb.project_id)
                resolve(updatedProjectsArray)
            })
            .catch(() => reject(null))
    })
}

const updateUserData = (rb, instructions) => {
    // input 1: object that has key 'user_id'.
    // input 2: object containing query instructions
    //  action: find the user matching 'user_id', update user with instructions
    //  return: updated user object
    return new Promise((resolve, reject) => {
        db.User.findByIdAndUpdate(rb.user_id, instructions, { new: true })
            .populate("projects")
            .then(data => resolve(data))
            .catch(() => reject(null))
    })
}

const updateProjectData = (rb) => {
    // find keys attached to req.body and update project with the new values
    const projectObj = { lastEdited: Date() }
    if (rb.title) projectObj.title = rb.title
    if (rb.public) projectObj.public = rb.public
    if (rb.gitHubRepo) projectObj.gitHubRepo = rb.gitHubRepo
    if (rb.description) projectObj.description = rb.description
    return projectObj
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
    getUsersUpdatedProjectsArr,
    updateUserData,
    updateProjectData,
    deleteProject
}