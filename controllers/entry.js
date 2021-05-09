const router = require("express").Router();
const { Entry } = require("../models");
const db = require("../models");
const { findById } = require("../models/user");
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const { findProjectToEdit, findProjectKeysToUpdate, updateProjectData, addEntryToProject, deleteProject } = require('../utils/projectHelpers')
const { getUsersUpdatedProjectsArr, addProjectToUser } = require('../utils/userHelpers')
const { createEntry, findEntryToEdit } = require('../utils/entryHelpers')


router.post('/api/entry', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    rb.admin_id = rb.user_id // add admin_id property as user_id that created it

    const entry = await createEntry(rb)
    if (!entry) {
        res.status(500).json('error, entry not created')
        return
    }
    const updated = await addEntryToProject(rb, entry._id)
    if (!updated) {
        res.status(500).json('error, project data not updated')
        return
    }
    res.json(entry)
})

router.put('/api/entry', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    const entryToEdit = await findEntryToEdit(rb)

    if (!entryToEdit) {
        res.status(500).json('error, no project found')
        return
    }
    if (projectToEdit.admin_id != rb.user_id) {
        res.status(500).json('Not authorized to edit this project')
        return
    }
    const updatedProject = await updateProjectData(rb)
    if (!updatedProject) {
        res.status(500).json('Project failed to update')
        return
    }
    res.json(updatedProject)

})


module.exports = router