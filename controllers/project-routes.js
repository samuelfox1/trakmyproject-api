const router = require("express").Router();
const { verifyAuthorizationToken } = require('../utils/authentication')
const { addProjectToUser, deleteProjectFromUser } = require('../utils/userHelpers')
const {
    createProject,
    findProjectById,
    updateProject,
    deleteProject,
} = require('../utils/projectHelpers')
const { respondWithError,
    expiredToken,
    forbidden,
} = require('../utils/statusCodes')

const projectRoute = '/api/project'


// ----------------------- POST ----------------------
router.post(projectRoute, async (req, res) => {
    try {
        const { body } = req
        body.admin_id = body.user_id // add admin_id property as user_id that created it
        const createdProject = await createProject(body)
        const updatedUsersProjects = await addProjectToUser(body, createdProject._id)
        res.json(updatedUsersProjects)
    } catch (err) {
        res.status(500).json(error)
    }
})


// ----------------------- GET -----------------------
router.get(projectRoute, async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const { project_id } = req.body
        const projectFound = await findProjectById(project_id)
        res.json(projectFound)
    } catch (error) {
        res.status(500).json(error)
    }
})


// ----------------------- PUT -----------------------
router.put(projectRoute, async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const { body } = req
        const { user_id, project_id, data } = body
        const projectFound = await findProjectById(project_id)
        if (projectFound.admin_id !== user_id) return res.status(403).send('forbidden')
        const updatedProject = await updateProject(project_id, data)
        res.json(updatedProject)
    } catch (error) {
        res.status(500).json(error)
    }
})


// ---------------------- DELETE ---------------------
router.delete(projectRoute, async (req, res) => {
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