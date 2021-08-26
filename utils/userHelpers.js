const { User } = require("../models");

const handleError = (err, message) => { throw new Error({ error: err, message: message }) }

const createUser = (rb) => {
    return new Promise(resolve => {
        try {

            User.create(rb)
                .then(data => resolve(data))
                .catch(err => handleError(err, 'bad inputs'))

        } catch (err) { handleError(err, 'createUser() failed') }
    })
}

const findUserByEmail = (email) => {
    return new Promise(resolve => {
        try {

            User.findOne({ email: email })
                .then(user => resolve(user))
                .catch(err => handleError(err, 'bad inputs'));

        } catch (err) { handleError(err, 'findUserByEmail() failed)') }
    })
}

const findUserByUsername = (username) => {
    return new Promise(resolve => {
        try {

            User.findOne({ username: username }).populate('projects')
                .then(user => resolve(user))
                .catch(err => handleError(err, 'bad inputs'));

        } catch (err) { handleError(err, 'findUserByUsername() failed') }
    })
}

const updateUserData = (rb) => {
    return new Promise(resolve => {
        try {

            User.findByIdAndUpdate(rb.user_id, { data: rb }, { new: true })
                .then(result => resolve(result))
                .catch(err => handleError(err, 'bad inputs'))

        } catch (err) { handleError(err, 'updateUserData query failure') }
    })
}

const updateUsername = (user_id, username) => {
    return new Promise(resolve => {
        try {

            User.findByIdAndUpdate(user_id, { username: username }, { new: true })
                .then(updatedUserData => resolve(updatedUserData))
                .catch(err => handleError(err, 'bad inputs'))

        } catch (err) { handleError(err, 'updateUsername query failure') }
    })
}

const updatePassword = (user_id, newPassword) => {
    return new Promise(async resolve => {
        // use the save() method to access middleware to encrypt new password
        try {

            const userDataToUpdate = await User.findById(user_id)
            if (!userDataToUpdate) return handleError(_, 'user to update not found')
            userDataToUpdate.password = newPassword

            const updatedUserData = await userDataToUpdate.save()
            if (!updatedUserData) return handleError(_, 'user password failed to update')
            return resolve(updatedUserData)

        } catch (err) { handleError(err, 'updatePassword query failure') }
    })
}

// const deleteUser = (resolve, reject, rb) => {
//     if (!isValidId(rb.user_id)) reject(message)
//     User.findByIdAndDelete(rb.user_id)
//         .then(data => resolve(data))
//         .catch(err => reject(err))
// }

const addProjectToUser = (_id, projectId) => {
    return new Promise(resolve => {
        try {

            User.findByIdAndUpdate(
                _id,
                { $addToSet: { projects: projectId } },
                { new: true }
            ).populate("projects")
                .then(data => resolve(data))
                .catch(err => handleError(err, 'no user found to add project too'))

        } catch (err) { handleError(err, 'addProjectToUser() failed') }
    })
}

const deleteProjectFromUser = (user_id, project_id) => {
    return new Promise(async resolve => {
        try {

            User.findByIdAndUpdate(
                user_id,
                { $pull: { projects: project_id } },
                { new: true }
            ).populate("projects")
                .then(updatedUser => resolve(updatedUser))
                .catch((err) => handleError(err, 'user or project not found to delete project from user'))

        } catch (err) { handleError(err, 'deleteProjectFromUser() failed') }
    })
}

const secureUserData = (obj) => {
    obj.password = ''
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
    secureUserData
}