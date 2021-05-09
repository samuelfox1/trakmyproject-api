const router = require("express").Router();
const { Entry } = require("../models");
const db = require("../models");
const { findById } = require("../models/user");
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const { findProjectToEdit, findProjectKeysToUpdate, updateProjectData, addEntryToProject, deleteProject } = require('../utils/projectHelpers')
const { getUsersUpdatedProjectsArr, updateUserData } = require('../utils/userHelpers')



router.post('/api/entry', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    const entry = await db.Entry.create(rb)
        .then(data => data)
        .catch(() => null)
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


module.exports = router