const router = require("express").Router();
const { verifyAuthorizationToken } = require('../utils/authentication')
const { addProjectToUser, deleteProjectFromUser } = require('../utils/userHelpers')
const {
    createProject,
    findProjectById,
    updateProject,
    deleteProject,
} = require('../utils/projectHelpers')
const { respondWithError, expiredToken, forbidden, } = require('../utils/statusCodes');
const { find } = require("../models/User");


// ----------------------- POST ----------------------
router.post('/', async (req, res) => {
    try {
        const { body } = req
        console.log(body)
        const newProject = await createProject(body)
        const updateUsersProjects = await addProjectToUser(body.admin_id, newProject._id)
        res.json(updateUsersProjects)
    } catch (error) {
        res.status(500).json(error)
    }
})


// ----------------------- GET -----------------------

// find all projects for the admin
router.get('/', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')

        const { _id } = req.body
        const foundProject = await find({ admin_id: _id })
        res.json(foundProject)
    } catch (error) {
        res.status(500).json(error)
    }
})

// find one project by id
router.get('/:id', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')

        const { id } = req.params
        const foundProject = await findProjectById(id)
        res.json(foundProject)
    } catch (error) {
        res.status(500).json(error)
    }
})


// ----------------------- PUT -----------------------
router.put('/', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')

        const { body } = req
        const { user_id, project_id, data } = body
        const foundProject = await findProjectById(project_id)
        if (foundProject.admin_id !== user_id) return res.status(403).send('forbidden')
        const updatedProject = await updateProject(project_id, data)
        res.json(updatedProject)
    } catch (error) {
        res.status(500).json(error)
    }
})


// ---------------------- DELETE ---------------------
router.delete('/', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')

        const { user_id, project_id } = req.body
        const projectToDelete = await findProjectById(project_id)
        if (projectToDelete.admin_id !== user_id) return res.status(403).send('forbidden')
        await deleteProject(project_id)
        await deleteProjectFromUser(user_id, project_id)
        res.json('success')
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router