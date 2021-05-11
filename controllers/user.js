const router = require("express").Router();
const db = require("../models");
const { default: axios } = require('axios');
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const {
    createUser,
    findUser,
    updateUserData,
} = require('../utils/userHelpers')
require('dotenv').config();


router.post('/api/signup', (req, res) => {
    const creatNewUser = new Promise((resolve, reject) => createUser(resolve, reject, req.body))
    creatNewUser
        .then(newUser => res.json({ user: newUser, token: generateNewToken(newUser) }))
        .catch(err => res.status(500).json(err))
});

router.post('/api/login', (req, res) => {
    const respondWithError = () => res.status(401).json('incorrect username or password')
    const user = new Promise((resolve, reject) => findUser(resolve, reject, req.body))
    user
        .then(user => {
            checkPassword(req.body, user) ? res.json({ user: user, token: generateNewToken(user) }) : respondWithError()
        })
        .catch(() => respondWithError())
});

router.put('/api/user', (req, res) => {
    const authorizedUser = authenticateUser(req);
    if (!authorizedUser) return res.status(401).json('unauthorized, please log in')
    const updateUser = new Promise((resolve, reject) => updateUserData(resolve, reject, req.body))
    updateUser
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err))
})

router.get('/api/user', (req, res) => {
    const authorizedUser = authenticateUser(req);
    if (!authorizedUser) return res.status(401).json('unauthorized, please log in')
    const user = new Promise((resolve, reject) => findUser(resolve, reject, authorizedUser))
    user
        .then(u => res.json(u))
        .catch(err => res.status(500).json(err))
});

// router.get('/api/github', (req, res) => {
//     const url = 'https://api.github.com'
//     // const url = 'https://api.github.com/rate_limit'
//     // const url = "https://randomuser.me/api/?results=50"
//     axios.get(url)
//         .then(data => res.json(data.data))
//         .catch(err => res.status(500).json(err))
// })

module.exports = router;