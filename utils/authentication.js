const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config()

const SECRET = process.env.PRIVATEKEY

const authenticateUser = (req) => {
    /* expected header sent with get request
    headers: {
        authorization: `Bearer: ${token}`
    }
    */
    if (!req.headers || !req.headers.authorization) return null  // no header or authorization in header
    const token = req.headers.authorization.split(" ")[1]  // update token to the Bearer value
    const data = verify(token, SECRET, (err, data) => err ? null : data);
    return data ? data : null;
};

const checkPassword = (rb, user) => {
    // if a user is found and hashed passwords match, return the user and a new token
    if (user && bcrypt.compareSync(rb.password, user.password)) return true
    return false;
}

const generateNewToken = (user) => {
    const token = sign(
        { username: 'username', id: '_id' },
        SECRET,
        { expiresIn: "2h", });
    return token
}
module.exports = { authenticateUser, checkPassword, generateNewToken }