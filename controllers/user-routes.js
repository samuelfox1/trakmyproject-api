const router = require("express").Router();
const { verifyAuthorizationToken, verifyUserPassword, generateNewToken } = require('../utils/authentication')
const { respondWithError, unauthorized, invalidToken, } = require('../utils/statusCodes');
const {
    createUser,
    findUserByEmail,
    findUserByUsername,
    updateUserData,
    updateUsername,
    updatePassword,
    secureUserData
} = require('../utils/userHelpers')

// ------------------- POST ----------------------

// create new user account
// /api/user
router.post('/', async (req, res) => {
    try {
        const { body } = req
        const newUser = await createUser(body)
        res.json({
            user: secureUserData(newUser),
            token: generateNewToken(newUser)
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// check if email is already used
router.post('/email', async (req, res) => {
    try {
        const { email } = req.body
        const emailFound = await findUserByEmail(email)
        res.json(emailFound ? true : false)
    } catch (error) {
        res.status(500).json(error)
    }
})

// check if username is already used
router.post('/username', async (req, res) => {
    try {
        const { username } = req.body
        const usernameFound = await findUserByUsername(username)
        res.json(usernameFound ? true : false)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.post('/login', async (req, res) => {
    try {
        const { password, username } = req.body
        const userToLogin = await findUserByUsername(username)

        if (!verifyUserPassword(password, userToLogin.password)) return res.status(401).send('unauthorized')
        res.json({
            user: secureUserData(userToLogin),
            token: generateNewToken(userToLogin)
        })
    } catch (error) {
        res.status(500).json(error)
    }
});


// -------------------- GET ----------------------

//get logged in user's data
router.get('/', async (req, res) => {
    try {
        const authenticatedUser = verifyAuthorizationToken(req)
        if (!authenticatedUser) return res.status(401).send('unauthorized')

        const { username } = authenticatedUser
        const loggedInUserData = await findUserByUsername(username)
        if (!loggedInUserData) return res.status(404).send('user not found')
        res.json({
            user: secureUserData(loggedInUserData),
            token: generateNewToken(loggedInUserData)
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// -------------------- PUT ----------------------

//update logged in user's data
router.put('/data', async (req, res) => {

    try {
        if (!verifyAuthorizationToken(req)) return respondWithError(res, 401, invalidToken)
        const { body } = req
        const updatedUserData = await updateUserData(body)
        res.json({
            user: secureUserData(updatedUserData),
            token: generateNewToken(updatedUserData)
        })

    } catch (error) {
        res.status(500).json(error)
    }
})

//update logged in user's username
router.put('/username', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const { user_id, username } = req.body
        const updatedUserData = await updateUsername(user_id, username)
        res.json({
            user: secureUserData(updatedUserData),
            token: generateNewToken(updatedUserData)
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

//update logged in user's password
router.put('/password', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const { user_id, password, newPassword } = req.body
        const userToUpdatePassword = await findUserById(user_id)
        if (!verifyUserPassword(password, userToUpdatePassword.password)) return es.status(401).send('unauthorized')

        const updatedUserData = await updatePassword(user_id, newPassword)
        res.json({ user: secureUserData(updatedUserData), token: generateNewToken(updatedUserData) })
    } catch (error) {
        res.status(500).json(error)
    }
})

// ------------------- DELETE --------------------

// // delete user from database
// router.delete('/api/user', (req, res) => {
//     if (!verifyAuthorizationToken(req)) return respondWithError(res, 401, invalidToken)
//     const rb = req.body
//     const user = new Promise((resolve, reject) => findUserById(resolve, reject, rb))
//     user
//         .then(user => {
//             if (!user) return respondWithError(res, 404, notFound)
//             if (!verifyUserPassword(rb, user)) return respondWithError(res, 401, unauthorized)
//             const deleted = new Promise((resolve, reject) => deleteUser(resolve, reject, rb))
//             deleted
//                 .then(data => res.json({ deleted: data }))
//                 .catch(error => respondWithError(res, 500, error))
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
//         .catch(error => res.status(500).json(error))
// })

module.exports = router;