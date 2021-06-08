const router = require("express").Router();
const { authenticateUser, checkPassword, generateNewToken } = require('../utils/authentication')
const {
    createUser,
    findUserByEmail,
    findUserByUsername,
    // findUserById,
    updateUserData,
    updateUsername,
    updatePassword,
    // deleteUser,
    safeUserData
} = require('../utils/userHelpers')
const { respondWithError,
    usernameUnavailable,
    unauthorized,
    invalidToken,
    serverError,
    notFound
} = require('../utils/statusCodes');
const User = require("../models/user");


// ------------------- POST ----------------------

router.post('/api/user', async (req, res) => {
    try {
        await createUser(req.body)
            .then(user => res.json({ user: safeUserData(user), token: generateNewToken(user) }))
            .catch(err => res.status(500).json(err))
    } catch (err) { res.status(500).json(err) }
});

// check available email on signup
router.post('/api/user/email', async (req, res) => {
    const { email } = req.body
    if (!email) return respondWithError(res, 422, `missing required inputs`)
    try {
        await findUserByEmail(email)
            .then(userIsFound => userIsFound ? res.json(false) : res.json(true))
            .catch((err) => res.status(500).json(err))
    } catch (err) { res.status(500).json(err) }
})

// check available username on signup
router.post('/api/user/username', async (req, res) => {
    const { username } = req.body
    if (!username) return respondWithError(res, 422, `missing required inputs`)
    try {
        await findUserByUsername(username)
            .then(userIsFound => userIsFound ? res.json(false) : res.json(true))
            .catch(err => res.status(500).json(err))
    } catch (err) { res.status(500).json(err) }
})

router.post('/api/user/login', async (req, res) => {
    const { password, username } = req.body
    try {
        if (!password || !username) return respondWithError(res, 422, `missing required inputs`)
        await findUserByUsername(username)
            .then(user => {
                if (checkPassword(password, user.password)) return res.json({ user: safeUserData(user), token: generateNewToken(user) })
                respondWithError(res, 401, unauthorized)
            })
            .catch(err => res.status(500).json(err))
    } catch (err) { res.status(500).json(err) }
});

// -------------------- GET ----------------------

//get logged in user data
router.get('/api/user', async (req, res) => {
    const authenticatedUsername = authenticateUser(req);
    if (!authenticatedUsername) return respondWithError(res, 401, invalidToken)
    try {
        await findUserByUsername(authenticatedUsername.username)
            .then(user => res.json({ user: safeUserData(user), token: generateNewToken(user) }))
            .catch(err => res.status(500).json(err)) //status code?
    } catch (err) { res.status(500).json(err) }
});

// -------------------- PUT ----------------------

//update logged in users data
router.put('/api/user/data', async (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, invalidToken)
    try {
        await updateUserData(req.body)
            .then(user => res.json({ user: safeUserData(user), token: generateNewToken(user) }))
            .catch(err => res.status(500).send(err)) //status code?
    } catch (err) { res.status(500).json(err) }
})

//update logged in users username
router.put('/api/user/username', async (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, invalidToken)
    const { user_id, username } = req.body
    try {
        await updateUsername(user_id, username)
            .then(user => res.json({ user: safeUserData(user), token: generateNewToken(user) }))
            .catch(err => respondWithError(res, 418, usernameUnavailable(err.keyValue?.username)))
    } catch (err) { res.status(500).json(err) }
})

//update logged in users password
router.put('/api/user/password', async (req, res) => {
    if (!authenticateUser(req)) return respondWithError(res, 401, invalidToken)
    const { user_id, password, newPassword } = req.body
    let user
    try {
        await findUserById(user_id)
            .then(foundUser => user = foundUser)
            .catch(() => respondWithError(res, 404, notFound))
        if (!user) return respondWithError(res, 404, notFound)
        if (!checkPassword(password, user.password)) return respondWithError(res, 401, unauthorized)

        await updatePassword(user_id, newPassword)
            .then(user => res.json({ user: safeUserData(user), token: generateNewToken(user) }))
            .catch(err => respondWithError(res, 500, err))
    } catch (err) { res.status(500).json(err) }
})

// ------------------- DELETE --------------------

// // delete user from database
// router.delete('/api/user', (req, res) => {
//     if (!authenticateUser(req)) return respondWithError(res, 401, invalidToken)
//     const rb = req.body
//     const user = new Promise((resolve, reject) => findUserById(resolve, reject, rb))
//     user
//         .then(user => {
//             if (!user) return respondWithError(res, 404, notFound)
//             if (!checkPassword(rb, user)) return respondWithError(res, 401, unauthorized)
//             const deleted = new Promise((resolve, reject) => deleteUser(resolve, reject, rb))
//             deleted
//                 .then(data => res.json({ deleted: data }))
//                 .catch(err => respondWithError(res, 500, err))
//         })
//         .catch(() => respondWithError(401, unauthorized))
// })

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