const db = require("../models");
const { authenticateUser, checkPassword, generateNewToken } = require('./authentication')



const createUser = (resolve, reject, rb) => {
    db.User.create(rb)
        .then(newUser => resolve(newUser))
        .catch((err) => reject(err))
}

const findUser = (resolve, reject, rb) => {
    db.User.findOne({ username: rb.username })
        .populate('projects')
        .then(user => resolve(user))
        .catch(err => reject(err));
}

const updateUserData = (resolve, reject, rb) => {
    db.User.findOneAndUpdate({ _id: rb.user_id }, { data: rb }, { new: true })
        .then(result => resolve(result))
        .catch(err => reject(err))
}

const getUsersUpdatedProjectsArr = (rb) => {
    return new Promise((resolve, reject) => {
        db.User.findById(rb.user_id)
            .then(user => {
                const updatedProjectsArray = user.projects.filter(project => project._id != rb.project_id)
                resolve(updatedProjectsArray)
            })
            .catch(() => reject(null))
    })
}

const addProjectToUser = (rb, projectId) => {
    return new Promise((resolve, reject) => {
        db.User.findByIdAndUpdate(
            rb.user_id,
            { $addToSet: { projects: projectId } },
            { new: true })
            .populate("projects")
            .then(updatedUser => resolve(updatedUser))
            .catch(() => reject(null))
    })
}

module.exports = {
    createUser,
    findUser,
    updateUserData,
    getUsersUpdatedProjectsArr,
    addProjectToUser
}