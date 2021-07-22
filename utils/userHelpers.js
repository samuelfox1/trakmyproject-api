const db = require("../models");
const mongoose = require("mongoose");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)
const message = 'invalid user_id'

const createUser = (rb) => {
    return new Promise((resolve, reject) => {
        try {
            db.User.create(rb)
                .then(data => resolve(data))
                .catch(err => reject({ error: err, message: 'illegal inputs' }))
        } catch (err) { throw new Error({ error: err, message: 'createUser querey failure' }) }
    })
}

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            db.User.findOne({ email: email })
                .then(user => resolve(user))
                .catch(err => reject(err));
        } catch (err) { throw new Error({ error: err, message: 'findUserByEmail query failure' }) }
    })
}

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        try {
            db.User.findOne({ username: username })
                .populate('projects')
                .then(user => resolve(user))
                .catch(err => reject({ error: err, message: 'illegal inputs' }));
        } catch (err) { throw new Error({ error: err, message: 'findUserByUsername query failure' }) }
    })
}

// const findUserById = (resolve, reject, rb) => {
//     if (!isValidId(rb.user_id)) reject(message)
//     db.User.findById(rb.user_id)
//         .populate('projects')
//         .then(user => resolve(user))
//         .catch(err => reject(err));
// }

const updateUserData = (rb) => {
    return new Promise((resolve, reject) => {
        if (!isValidId(rb.user_id)) reject(message)
        try {
            db.User.findByIdAndUpdate(rb.user_id, { data: rb }, { new: true })
                .then(result => resolve(result))
                .catch(err => reject(err))
        } catch (err) { throw new Error({ error: err, message: 'updateUserData query failure' }) }
    })
}

const updateUsername = (user_id, username) => {
    return new Promise((resolve, reject) => {
        if (!isValidId(user_id)) reject(message)
        try {
            db.User.findByIdAndUpdate(user_id, { username: username }, { new: true })
                .then(updatedUserData => resolve(updatedUserData))
                .catch(err => reject(err))
        } catch (err) { throw new Error({ error: err, message: 'updateUsername query failure' }) }
    })
}

const updatePassword = async (user_id, newPassword) => {
    return new Promise(async (resolve, reject) => {
        if (!isValidId(user_id)) reject(message)
        // setup query this way, save() method accesses middleware to encrypt new password
        try {
            const doc = await db.User.findById(user_id)
            if (!doc) reject('document not found')
            doc.password = newPassword
            doc.save()
                .then(data => resolve(data))
                .catch(err => reject(err))
        } catch (err) { throw new Error({ error: err, message: 'updatePassword query failure' }) }
    })
}

// const deleteUser = (resolve, reject, rb) => {
//     if (!isValidId(rb.user_id)) reject(message)
//     db.User.findByIdAndDelete(rb.user_id)
//         .then(data => resolve(data))
//         .catch(err => reject(err))
// }

const addProjectToUser = async (rb, projectId) => {
    // if (!isValidId(rb.user_id)) reject(message)
    return new Promise((resolve, reject) => {
        try {
            const updatedUser = await db.User.findByIdAndUpdate(
                rb.user_id,
                { $addToSet: { projects: projectId } },
                { new: true }
            ).populate("projects")

            if (updatedUser) resolve(updatedUser)
            else throw new Error({ error: err, message: 'addProjectToUser() failed' })
        } catch (err) { throw new Error({ error: err, message: 'addProjectToUser() failed' }) }
    })
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

const safeUserData = (obj) => {
    obj.password = undefined
    return obj
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserByUsername,
    // findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    // deleteUser,
    addProjectToUser,
    deleteProjectFromUser,
    safeUserData
}