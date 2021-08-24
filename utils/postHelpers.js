const { Post } = require("../models");

const createPost = (rb) => {
    return new Promise((resolve, reject) => {
        Post.create(rb)
            .then(post => resolve(post))
            .catch(() => reject(null))
    })
}

const findPostToEdit = (rb) => {
    //  input: object that has key 'project_id'
    // action: find the project for the id 
    // return: the project object
    return new Promise((resolve, reject) => {
        Post.findById(rb.post_id)
            .then(p => resolve(p))
            .catch(() => reject({ admin: null }))
    })
}

const findPostKeysToUpdate = (rb) => {
    // find keys attached to req.body and update project with the new values
    const postObj = { lastEdited: Date() }
    if (rb.title) postObj.title = rb.title
    if (rb.body) postObj.body = rb.body
    return postObj
}

// const addImage
// const removeImage




module.exports = {
    createPost,
    findPostToEdit
}