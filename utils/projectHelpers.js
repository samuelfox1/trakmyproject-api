const db = require("../models");

const createProject = (body) => {
    return new Promise((resolve, reject) => {
        try {
            db.Project.create(body)
                .then(data => resolve(data))
                .catch(error => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

const findProjectById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.Project.findById(id)
                .then(data => resolve(data))
                .catch(error => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

const updateProject = (id, data) => {
    return new Promise((resolve, reject) => {
        try {
            db.Project.findByIdAndUpdate(id, { data: data }, { new: true }).populate("posts")
                .then(data => resolve(data))
                .catch(error => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

const deleteProject = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.Project.findByIdAndDelete(id)
                .then(data => resolve(data))
                .catch(error => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

// const addPostToProject = (rb, postId) => {
//     return new Promise(((resolve, reject) => {
//         db.Project.findByIdAndUpdate(
//             rb.project_id,
//             { $addToSet: { posts: postId } },
//             { new: true }
//         )
//             .populate("posts")
//             .then(data => resolve(data))
//             .catch(error => reject(error))
//     })
// }

module.exports = {
    createProject,
    findProjectById,
    updateProject,
    deleteProject
}