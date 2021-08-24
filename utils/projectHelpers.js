const db = require("../models");

const handleError = (err, message) => { throw new Error({ error: err, message: message }) }

const createProject = (body) => {
    return new Promise(resolve => {
        try {

            db.Project.create(body)
                .then(data => resolve(data))
                .catch(err => handleError(err, 'failed to create project'))

        } catch (err) { handleError(err, 'createProject() failed') }
    })
}

const findProjectById = (id) => {
    return new Promise(resolve => {
        try {

            db.Project.findById(id)
                .then(data => resolve(data))
                .catch(err => handleError(err, 'failed to find project my id'))

        } catch (err) { handleError(err, 'findProjectById() failed') }
    })
}

const updateProject = (id, data) => {
    return new Promise(resolve => {
        try {

            db.Project.findByIdAndUpdate(id, { data: data }, { new: true }).populate("posts")
                .then(data => resolve(data))
                .catch(err => handleError(err, 'project to update not found'))

        } catch (err) { handleError(err, 'updateProject() failed') }
    })
}

const deleteProject = (id) => {
    return new Promise(resolve => {
        try {

            db.Project.findByIdAndDelete(id)
                .then(data => resolve(data))
                .catch(err => handleError(err, 'project to delete not found'))

        } catch (err) { handleError(err, 'deleteProject() failed') }
    })
}

// const addPostToProject = (rb, postId) => {
//     return new Promise((resolve, reject) => {
//         db.Project.findByIdAndUpdate(
//             rb.project_id,
//             { $addToSet: { posts: postId } },
//             { new: true }
//         )
//             .populate("posts")
//             .then(data => resolve(data))
//             .catch(err => reject(err))
//     })
// }

module.exports = {
    createProject,
    findProjectById,
    updateProject,
    deleteProject
}