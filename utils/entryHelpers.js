const db = require("../models");

const createEntry = (rb) => {
    return new Promise((resolve, reject) => {
        db.Entry.create(rb)
            .then(entry => resolve(entry))
            .catch(() => reject(null))
    })
}

const findEntryToEdit = (rb) => {
    //  input: object that has key 'project_id'
    // action: find the project for the id 
    // return: the project object
    return new Promise((resolve, reject) => {
        db.Entry.findById(rb.entry_id)
            .then(p => resolve(p))
            .catch(() => reject({ admin: null }))
    })
}

const findEntryKeysToUpdate = (rb) => {
    // find keys attached to req.body and update project with the new values
    const entryObj = { lastEdited: Date() }
    if (rb.title) entryObj.title = rb.title
    if (rb.body) entryObj.body = rb.body
    return entryObj
}

// const addImage
// const removeImage




module.exports = {
    createEntry,
    findEntryToEdit
}