const db = require("../models");

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


module.exports = {
    updateProjectEntriesArr
}