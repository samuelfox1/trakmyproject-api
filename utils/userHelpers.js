const db = require("../models");


const isUserNameAvailable = () => {

}


const createUser = (resolve, reject, rb) => {
    db.User.create(rb)
        .then(newUser => resolve(newUser))
        .catch((err) => reject(err))
}

const getUsersData = (req, authenticatedUser) => {
    return new Promise((resolve, reject) => {
        db.User.findOne({ _id: authenticatedUser.id })
            .populate('projects')
            .then(user => {
                const token = req.headers.authorization.split(" ")[1];
                resolve({ user, token });
            })
            .catch(() => reject(null));
    })
}

const getUsersUpdatedProjectsArr = (rb) => {
    //  input: object that has key 'user_id' & 'project_id'
    // action: find the user object for the user_id
    // return: an array of all project excluding the 'project_id' from input
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
    // input 1: object that has key 'user_id'.
    // input 2: object containing query instructions
    //  action: find the user matching 'user_id', update user with instructions
    //  return: updated user object
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
    getUsersData,
    getUsersUpdatedProjectsArr,
    addProjectToUser
}