const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateMe = (req) => {
    let token = false;
    if (!req.headers) { token = false } // no header
    else if (!req.headers.authorization) { token = false } // no authorization in header
    else { token = req.headers.authorization.split(" ")[1] } // update token
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
            console.log("newUser", user);
            const token = jwt.sign(
                {
                    username: user.username,
                    id: user._id,
                },
                process.env.PRIVATEKEY,
                {
                    expiresIn: "2h",
                }
            );
            res.json({ user: user, token: token });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});