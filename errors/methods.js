const { AppError } = require('./appError')
const { ERROR } = require('./errors')

module.exports.throwUnAuthenticatedError = (response, message, isOperational = true) => {
  let error = new AppError(ERROR.UNAUTHENTICATED.TYPE, message, ERROR.UNAUTHENTICATED.CODE, isOperational)
  return response.status(ERROR.UNAUTHENTICATED.CODE).send(error)
}

module.exports.throwBadRequestError = (response, message, isOperational = true) => {
  let error = new AppError(ERROR.BAD_REQUEST.TYPE, message, ERROR.BAD_REQUEST.CODE, isOperational)
  return response.status(ERROR.BAD_REQUEST.CODE).send(error)
}

module.exports.throwNotFoundError = (response, message, isOperational = true) => {
  let error = new AppError(ERROR.NOT_FOUND.TYPE, message, ERROR.NOT_FOUND.CODE, isOperational)
  return response.status(ERROR.NOT_FOUND.CODE).send(error)
}

module.exports.throwUnAuthorizedError = (response, message, isOperational = true) => {
  let error = new AppError(ERROR.UNAUTHORIZED.TYPE, message, ERROR.UNAUTHORIZED.CODE, isOperational)
  return response.status(ERROR.UNAUTHORIZED.CODE).send(error)
}

module.exports.throwInternalServerError = (response, message, isOperational = true) => {
  let error = new AppError(ERROR.INTERNAL_SERVER_ERROR.TYPE, message, ERROR.INTERNAL_SERVER_ERROR.CODE, isOperational)
  return response.status(ERROR.INTERNAL_SERVER_ERROR.CODE).send(error)
}
