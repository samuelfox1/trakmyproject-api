const db = require("../models");
const mongoose = require("mongoose");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)
const message = 'invalid user_id'

const createUser = (resolve, reject, rb) => {
    db.User.create(rb)
        .then(data => resolve(data))//resolve(newUser))
        .catch(err => reject(err))
}

const findUserByUsername = (resolve, reject, rb) => {
    db.User.findOne({ username: rb.username })
        .populate('projects')
        .then(user => resolve(user))
        .catch(err => reject(err));
}

const findUserById = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject(message)
    db.User.findById(rb.user_id)
        .populate('projects')
        .then(user => resolve(user))
        .catch(err => reject(err));
}

const updateUserData = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject(message)
    db.User.findByIdAndUpdate(rb.user_id, { data: rb }, { new: true })
        .then(result => resolve(result))
        .catch(err => reject(err))
}

const updateUsername = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject(message)
    db.User.findByIdAndUpdate(rb.user_id, { username: rb.username }, { new: true })
        .then(result => resolve(result))
        .catch(err => reject(err))
}

const updatePassword = async (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject(message)
    // setup query this way, save() method accesses middleware to encrypt new password
    const doc = await db.User.findById(rb.user_id)
    if (!doc) resolve('document not found')
    doc.password = rb.newPassword
    doc.save()
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const deleteUser = (resolve, reject, rb) => {
    if (!isValidId(rb.user_id)) reject(message)
    db.User.findByIdAndDelete(rb.user_id)
        .then(data => resolve(data))
        .catch(err => reject(err))
}

const addProjectToUser = (resolve, reject, rb, projectId) => {
    if (!isValidId(rb.user_id)) reject(message)
    db.User.findByIdAndUpdate(
        rb.user_id,
        { $addToSet: { projects: projectId } },
        { new: true }
    )
        .populate("projects")
        .then(updatedUser => resolve(updatedUser))
        .catch((err) => reject(err))
}

const deleteProjectFromUser = (resolve, reject, rb) => {
    db.User.findByIdAndUpdate(
        rb.user_id,
        { $pull: { projects: rb.project_id } },
        { new: true }
    )
        .populate("projects")
        .then(updatedUser => resolve(updatedUser))
        .catch((err) => reject(err))
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    deleteUser,
    addProjectToUser,
    deleteProjectFromUser
}