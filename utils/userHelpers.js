const db = require("../models");

const getUsersUpdatedProjectsArr = (rb) => {
    //  input: object that has key 'user_id' & 'project_id'
    // action: find the user object for the user_id
    // return: an array of all project excluding the 'project_id' from input
    return new Promise((resolve, reject) => {
        db.User.findById(rb.user_id)
            .then(u => {
                const updatedProjectsArray = u.projects.filter(project => project._id != rb.project_id)
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

module.exports = {
    getUsersUpdatedProjectsArr,
    updateUserData
}