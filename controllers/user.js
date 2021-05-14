const router = require("express").Router();
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const {
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    deleteUser,
} = require('../utils/userHelpers')
const { respondWithError,
    usernameUnavailable,
    unauthorized,
    expiredToken,
    serverError,
    notFound
} = require('../utils/statusCodes')

// ------------------- POST ----------------------

// check available email on signup
router.post('/api/email', (req, res) => {
    const user = new Promise((resolve, reject) => findUserByEmail(resolve, reject, req.body))
    user
        .then(user => !user ? res.json(true) : res.json(false))
        .catch(() => res.json('noUser'))
})

// check available username on signup
router.post('/api/username', (req, res) => {
    const user = new Promise((resolve, reject) => findUserByUsername(resolve, reject, req.body))
    user
        .then(user => !user ? res.json(true) : res.json(false))
        .catch(() => res.json('noUser'))
})

// create new user
router.post('/api/user', (req, res) => {
    console.log(req.body)
    const creatNewUser = new Promise((resolve, reject) => createUser(resolve, reject, req.body))
    creatNewUser
        .then(newUser => {
            const formatted = {
                id: newUser._id,
                username: newUser.username,
                dateCreated: newUser.dateCreated,
                firsName: newUser.data.firsName,
                lastName: newUser.data.lastName,
                email: newUser.data.email,
                projects: newUser.projects,

            }
            res.json({ user: formatted, token: generateNewToken(newUser) })
        })
        .catch(err => res.status(500).json(err))
});

// user login
router.post('/api/login', (req, res) => {
    const rb = req.body
    const user = new Promise((resolve, reject) => findUserByUsername(resolve, reject, rb))
    user
        .then(user => {
            if (checkPassword(rb, user)) return res.json({ user: user, token: generateNewToken(user) })
            respondWithError(res, 401, unauthorized)
        })
        .catch(() => respondWithError(res, 500, serverError))
});

// -------------------- GET ----------------------

//get logged in user data
router.get('/api/user', (req, res) => {
    const authorizedUser = authenticateUser(req);
    console.log(authorizedUser)
    if (!authorizedUser) return respondWithError(res, 401, expiredToken)
    const user = new Promise((resolve, reject) => findUserByUsername(resolve, reject, authorizedUser))
    user
        .then(u => res.json(u))
        .catch(err => res.status(500).json(err))
});

// -------------------- PUT ----------------------

//update logged in users data
router.put('/api/user/data', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const updateUser = new Promise((resolve, reject) => updateUserData(resolve, reject, req.body))
    updateUser
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err))
})

//update logged in users username
router.put('/api/user/username', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const updated = new Promise((resolve, reject) => updateUsername(resolve, reject, rb))
    updated
        .then(data => res.json(data))
        .catch(err => respondWithError(res, 418, usernameUnavailable(err)))
})

//update logged in users password
router.put('/api/user/password', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const user = new Promise((resolve, reject) => findUserById(resolve, reject, rb))
    user
        .then(user => {
            if (!user) return respondWithError(res, 404, notFound)
            if (!checkPassword(rb, user)) return respondWithError(res, 401, unauthorized)
            const updated = new Promise((resolve, reject) => updatePassword(resolve, reject, rb))
            updated
                .then(data => res.json(data))
                .catch(err => respondWithError(res, 500, err))
        })
        .catch(() => respondWithError(res, 404, notFound))
})

// ------------------- DELETE --------------------

// delete user from database
router.delete('/api/user', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, expiredToken)
    const rb = req.body
    const user = new Promise((resolve, reject) => findUserById(resolve, reject, rb))
    user
        .then(user => {
            if (!user) return respondWithError(res, 404, notFound)
            if (!checkPassword(rb, user)) return respondWithError(res, 401, unauthorized)
            const deleted = new Promise((resolve, reject) => deleteUser(resolve, reject, rb))
            deleted
                .then(data => res.json({ deleted: data }))
                .catch(err => respondWithError(res, 500, err))
        })
        .catch(() => respondWithError(401, unauthorized))
})

// require('dotenv').config();
// const { default: axios } = require('axios');

// router.get('/api/github', (req, res) => {
//     const url = 'https://api.github.com'
//     // const url = 'https://api.github.com/rate_limit'
//     // const url = "https://randomuser.me/api/?results=50"
//     axios.get(url)
//         .then(data => res.json(data.data))
//         .catch(err => res.status(500).json(err))
// })

module.exports = router;