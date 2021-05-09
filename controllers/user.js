const router = require("express").Router();
const db = require("../models");
const { default: axios } = require('axios');
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const { createUser, getUsersData } = require('../utils/userHelpers')
require('dotenv').config();




router.post('/api/signup', (req, res) => {
    const rb = req.body
    const creatNewUser = new Promise((resolve, reject) => createUser(resolve, reject, rb))
    creatNewUser
        .then(newUser => {
            const token = generateNewToken(newUser)
            res.json({ user: newUser, token: token });
        })
        .catch(err => res.status(500).json(err))
});


router.post('/api/login', (req, res) => {
    const rb = req.body
    db.User.findOne({ username: rb.username })
        .then(user => {
            const validUser = checkPassword(rb, user)
            if (validUser) {
                res.json(validUser);
                return
            }
            res.json({ err: 'invalid username or password' });
        })
        .catch(err => { res.status(500).json(err) });
});

router.put('/api/user', (req, res) => {
    res.json('route not available yet')
})

// Autenticate user login information and populate homepage with user data
router.get('/api/user', async (req, res) => {
    const authorizedUser = authenticateUser(req);
    if (authorizedUser) {
        const userObj = await getUsersData(req, authorizedUser)
        if (userObj) {
            res.json(userObj)
            return
        }
    }
    res.status(500).json('authorization failed, user is logged out')
});

router.get('/api/github', (req, res) => {
    const url = 'https://api.github.com'
    // const url = 'https://api.github.com/rate_limit'
    // const url = "https://randomuser.me/api/?results=50"
    axios.get(url)
        .then(data => res.json(data.data))
        .catch(err => res.status(500).json(err))
})

module.exports = router;