const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateMe = (req) => {
    /* expected header sent with get request
    headers: {
        authorization: `Bearer: ${token}`
    }
    */
    let token = false;
    if (!req.headers) { token = false } // no header
    else if (!req.headers.authorization) { token = false } // no authorization in header
    else { token = req.headers.authorization.split(" ")[1] } // update token to the Bearer value
    let data = false;
    if (token) {
        data = jwt.verify(token, process.env.PRIVATEKEY, (err, data) => {
            if (err) { return false }
            else { return data }
        });
    }
    return data;
};

router.post("/api/signup", (req, res) => {
    db.User.create(req.body)
        .then((user) => {
            const token = jwt.sign(
                {
                    username: user.username,
                    id: user._id,
                },
                process.env.PRIVATEKEY,
                { expiresIn: "2h" }
            );
            res.json({ user: user, token: token });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});


router.post("/api/login", (req, res) => {
    db.User.findOne({ username: req.body.username }).populate("projects")
        .then((user) => {
            if (user && bcrypt.compareSync(req.body.password, user.password)) { // if a user is found and hashed passwords match
                const token = jwt.sign(
                    {
                        username: user.username,
                        id: user.id,
                    },
                    process.env.PRIVATEKEY,
                    {
                        expiresIn: "2h",
                    }
                );
                res.json({ user: user, token: token });
            } else {
                res.json({ err: "invalid username or password" });
            }
        })
        .catch((err) => {
            res.status(500).json(err); // error message if login failed
        });
});

// Autenticate user login information and populate homepage with user data
router.get("/", (req, res) => {
    let tokenData = authenticateMe(req);
    if (tokenData) { // if token is verified, find the user that matches id from token
        db.User.findOne({ _id: tokenData.id }).populate("projects")
            .then((user) => {
                let token = req.headers.authorization.split(" ")[1];
                res.json({ user, token });
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    } else {
        res.status(403).send("authorization failed");
    }
});

module.exports = router;