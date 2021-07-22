const router = require("express").Router();
const db = require("../models");
const { authenticateUser } = require('../utils/authentication')
const { addProjectToUser, deleteProjectFromUser } = require('../utils/userHelpers')
const {
    createProject,
    findProject,
    updateProject,
    deleteProject
} = require('../utils/projectHelpers')
const { respondWithError,
    unauthorized,
    expiredToken,
    forbidden,
    serverError,
    notFound
} = require('../utils/statusCodes')

const projectRoute = '/api/project'

// ----------------------- POST ----------------------
router.post(projectRoute, async (req, res) => {
    const rb = req.body
    rb.admin_id = rb.user_id // add admin_id property as user_id that created it

    try {
        const createdProject = await createProject(rb)
        if (!createdProject._id) respondWithError(res, 500, 'project not created')
        const updatedUsersProjects = await addProjectToUser(rb, createdProject._id)
        if (updatedUsersProjects) res.json(updatedUsersProjects)
        else respondWithError(res, 500, 'error, user data not updated')
    } catch (err) { respondWithError(res, 500, `POST Request catch block of ${projectRoute}`) }
})

// ----------------------- GET -----------------------
router.get(projectRoute, (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const findAProject = new Promise((resolve, reject) => findProject(resolve, reject, rb))
    findAProject
        .then(project => res.json(project))
        .catch(() => respondWithError(res, 404, notFound))
})

// ----------------------- PUT -----------------------
router.put(projectRoute, (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const search = new Promise((resolve, reject) => findProject(resolve, reject, rb))
    search
        .then(project => {
            if (project.admin_id !== rb.user_id) return respondWithError(res, 403, forbidden)
            const updateProject = new Promise((resolve, reject) => updateProject(resolve, reject, rb))
            updateProject
                .then(project => res.json(project))
                .catch(() => respondWithError(res, 500, 'project failed to update'))
        })
        .catch(() => respondWithError(res, 404, notFound))
})

// ---------------------- DELETE ---------------------
router.delete(projectRoute, (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const projectToDelete = new Promise((resolve, reject) => findProject(resolve, reject, rb))
    projectToDelete
        .then(project => {
            if (project.admin_id !== rb.user_id) return respondWithError(res, 403, forbidden)
            const destroyed = new Promise((resolve, reject) => deleteProject(resolve, reject, rb))
            destroyed
                .then(() => {
                    const updateAdmin = new Promise((resolve, reject) => deleteProjectFromUser(resolve, reject, rb))
                    updateAdmin
                        .then(updated => res.json(updated))
                        .catch(err => respondWithError(res, 500, err))
                })
                .catch(err => respondWithError(res, 500, err))
        })
        .catch(() => respondWithError(res, 404, notFound))
})

module.exports = router