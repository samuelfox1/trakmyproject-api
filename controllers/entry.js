const router = require("express").Router();
const db = require("../models");
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')

const {
    findProjectToEdit,
    getUsersUpdatedProjectsArr,
    updateUserData,
    updateProjectData,
    deleteProject
} = require('../utils/crudHelpers')



router.post('/api/entry', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    const project = await findProjectToEdit(rb)



    res.json(project)
})


module.exports = router