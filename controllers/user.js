const router = require("express").Router();
const db = require("../models");
const { default: axios } = require('axios');
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
require('dotenv').config();




router.post('/api/signup', (req, res) => {
    db.User.create(req.body)
        .then((user) => {
            const token = generateNewToken(user)
            res.json({ user: user, token: token });
        })
        .catch((err) => { res.status(500).json(err) });
});


router.post('/api/login', (req, res) => {
    const rb = req.body
    db.User.findOne({ username: rb.username })
        .populate('projects')
        .then((user) => {
            const validUser = checkPassword(rb, user)
            if (!validUser) {
                res.json({ err: 'invalid username or password' });
                return
            }
            res.json(validUser);
        })
        .catch((err) => { res.status(500).json(err) });
});

router.put('')

// Autenticate user login information and populate homepage with user data
router.get('/api/user', (req, res) => {
    const verifiedToken = authenticateUser(req);

    // if token is verified, find the user that matches id from token and
    if (verifiedToken) {
        db.User.findOne({ _id: verifiedToken.id })
            .populate('projects')
            .then((user) => {
                const token = req.headers.authorization.split(" ")[1];
                res.json({ user, token });
            })
            .catch((err) => { res.status(500).json(err) });
        return
    }
    res.status(403).send('authorization failed');
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