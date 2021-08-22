const router = require("express").Router();
const { Entry } = require("../models");
const db = require("../models");
const { verifyAuthorizationToken, verifyUserPassword, generateNewToken } = require('../utils/authentication')
const { findProjectByIdToEdit, findProjectByIdKeysToUpdate, updateProjectData, addEntryToProject, deleteProject } = require('../utils/projectHelpers')
const { getUsersUpdatedProjectsArr, addProjectToUser } = require('../utils/userHelpers')
const { createEntry, findEntryToEdit } = require('../utils/entryHelpers')


router.post('/api/entry', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const rb = req.body
        rb.admin_id = rb.user_id // add admin_id property as user_id that created it
        const entry = await createEntry(rb)
        if (!entry) return res.status(500).json('error, entry not created')
        const updated = await addEntryToProject(rb, entry._id)
        if (!updated) return res.status(500).json('error, project data not updated')
        res.json(entry)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/api/entry', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const rb = req.body
        const entryToEdit = await findEntryToEdit(rb)
        if (!entryToEdit) return res.status(500).json('error, no project found')
        if (projectToEdit.admin_id != rb.user_id) return res.status(500).json('Not authorized to edit this project')
        const updatedProject = await updateProjectData(rb)
        if (!updatedProject) return res.status(500).json('Project failed to update')
        res.json(updatedProject)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router