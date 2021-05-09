const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const authenticateUser = (req) => {
    /* expected header sent with get request
    headers: {
        authorization: `Bearer: ${token}`
    }
    */
    if (!req.headers || !req.headers.authorization) return null  // no header or authorization in header
    const token = req.headers.authorization.split(" ")[1]  // update token to the Bearer value
    const data = jwt.verify(token, process.env.PRIVATEKEY, (err, data) => {
        if (err) return null
        return data
    });
    return data ? data : null;
};

const checkPassword = (rb, user) => {
    // if a user is found and hashed passwords match, return the user and a new token
    if (user && bcrypt.compareSync(rb.password, user.password)) return { user: user, token: generateNewToken(user) }
    return null;
}

const generateNewToken = (user) => {
    const token = jwt.sign(
        { username: user.username, id: user.id, },
        process.env.PRIVATEKEY,
        { expiresIn: "2h", }
    );
    return token
}



module.exports = { authenticateUser, checkPassword, generateNewToken }