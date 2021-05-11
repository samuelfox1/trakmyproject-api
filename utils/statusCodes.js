
const respondWithError = (res, code, message) => res.status(code).json(message)
const unauthorized = 'unauthenticated, incorrect username or password' // 401
const expiredToken = 'Expired Token, please login'// 401
const forbidden = 'The client does not have access rights to the content' // 403
const notFound = 'not found' // 404
const usernameUnavailable = (err) => `${err.keyValue.username} already in use` // 418 ;)
const serverError = 'internal server error' // 500

module.exports = {
    respondWithError,
    usernameUnavailable,
    unauthorized,
    expiredToken,
    forbidden,
    serverError,
    notFound
}