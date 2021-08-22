
const respondWithError = (res, code, message) => res.status(code).json(message)
const usernameUnavailable = (username) => `${username} is unavailable` // 418 ;)

const unauthorized = 'unauthenticated, incorrect username or password' // 401
const invalidToken = 'Invalid token, please login'// 401
const forbidden = 'The client does not have access rights to the content' // 403

module.exports = {
    respondWithError,
    usernameUnavailable,
    unauthorized,
    invalidToken,
    forbidden,
}