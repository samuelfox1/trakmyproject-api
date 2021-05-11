const db = require("../models");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { authenticateUser, checkPassword, generateNewToken } = require('./authentication')

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

const createUser = (resolve, reject, rb) => {
    db.User.create(rb)
        .then(newUser => resolve(newUser))
        .catch((err) => reject(err))
}

const findUserByUsername = (resolve, reject, rb) => {
    db.User.findOne({ username: rb.username })
        .populate('projects')
        .then(user => resolve(user))
        .catch(err => reject(err));
}

const findUserById = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject('invalid id')
    db.User.findById(rb.user_id)
        .populate('projects')
        .then(user => resolve(user))
        .catch(err => reject(err));
}

const updateUserData = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject('invalid id')
    db.User.findByIdAndUpdate(rb.user_id, { data: rb }, { new: true })
        .then(result => resolve(result))
        .catch(err => reject(err))
}

const updateUsername = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject('invalid id')
    db.User.findByIdAndUpdate(rb.user_id, { username: rb.username }, { new: true })
        .then(result => resolve(result))
        .catch(err => reject(err))
}

const updatePassword = async (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject('invalid id')
    // setup query this way, save() method accesses middleware to encrypt new password
    const doc = await db.User.findById(rb.user_id)
    if (!doc) resolve('document not found')
    doc.password = rb.newPassword
    doc.save()
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const deleteUser = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject('invalid id')
    db.User.findByIdAndDelete(rb.user_id)
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const getUsersUpdatedProjectsArr = (rb) => {
    return new Promise((resolve, reject) => {
        if (!isValidId(rb.user_id)) reject('invalid id')
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
    findUserByUsername,
    findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    deleteUser,
    getUsersUpdatedProjectsArr,
    addProjectToUser
}