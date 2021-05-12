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

// ----------------------- POST ----------------------
router.post('/api/project', (req, res) => {
    const rb = req.body
    rb.admin_id = rb.user_id // add admin_id property as user_id that created it
    const createProject = new Promise((resolve, reject) => createProject(resolve, reject, rb))
    createProject
        .then(project => {
            const updated = new Promise((resolve, reject) => addProjectToUser(resolve, reject, rb, project._id))
            updated
                .then(() => res.json(project))
                .catch(() => respondWithError(res, 500, 'error, user data not updated'))
        })
        .catch(() => respondWithError(res, 500, 'error, project not created'))
})

// ----------------------- GET -----------------------
router.get('/api/project', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const findAProject = new Promise((resolve, reject) => findProject(resolve, reject, rb))
    findAProject
        .then(project => res.json(project))
        .catch(() => respondWithError(res, 404, notFound))
})

// ----------------------- PUT -----------------------
router.put('/api/project', (req, res) => {
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
router.delete('/api/project', (req, res) => {
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