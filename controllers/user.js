const router = require("express").Router();
const db = require("../models");
const { default: axios } = require('axios');
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const {
    createUser,
    findUserByUsername,
    findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    deleteUser,
} = require('../utils/userHelpers')
require('dotenv').config();

const respondWithError = (res, code, message) => res.status(code).json(message)
const unauthorized = 'unauthenticated, incorrect username or password' // 401
const forbidden = 'The client does not have access rights to the content' // 403
const serverError = 'internal server error' // 500
const notFound = 'not found' // 404
const usernameUnavailable = 'username already in use' // 418


router.post('/api/signup', (req, res) => {
    const creatNewUser = new Promise((resolve, reject) => createUser(resolve, reject, req.body))
    creatNewUser
        .then(newUser => res.json({ user: newUser, token: generateNewToken(newUser) }))
        .catch(err => res.status(500).json(err))
});

router.post('/api/login', (req, res) => {
    const user = new Promise((resolve, reject) => findUserByUsername(resolve, reject, req.body))
    user
        .then(user => {
            if (checkPassword(req.body, user)) return res.json({ user: user, token: generateNewToken(user) })
            respondWithError(res, 401, unauthorized)
        })
        .catch(() => respondWithError(res, 500, serverError))
});

router.get('/api/user', (req, res) => {
    const authorizedUser = authenticateUser(req);
    if (!authorizedUser) return respondWithError(res, 401, unauthorized)
    const user = new Promise((resolve, reject) => findUserByUsername(resolve, reject, authorizedUser))
    user
        .then(u => res.json(u))
        .catch(err => res.status(500).json(err))
});

router.put('/api/user/data', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, unauthorized)

    const updateUser = new Promise((resolve, reject) => updateUserData(resolve, reject, req.body))
    updateUser
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err))
})

router.put('/api/user/username', (req, res) => {
    // if (!authenticateUser(req)) return respondWithError(res, 401, unauthorized)
    const rb = req.body
    const updated = new Promise((resolve, reject) => updateUsername(resolve, reject, rb))
    updated
        .then(data => res.json(data))
        .catch(err => err.keyValue?.username
            ? respondWithError(res, 418, `${err.keyValue.username} already taken`)
            : respondWithError(res, 418, err))
})

router.put('/api/user/password', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, unauthorized)
    const rb = req.body
    const user = new Promise((resolve, reject) => findUserById(resolve, reject, req.body))
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

router.delete('/api/user', (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, unauthorized)
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

// router.get('/api/github', (req, res) => {
//     const url = 'https://api.github.com'
//     // const url = 'https://api.github.com/rate_limit'
//     // const url = "https://randomuser.me/api/?results=50"
//     axios.get(url)
//         .then(data => res.json(data.data))
//         .catch(err => res.status(500).json(err))
// })

module.exports = router;