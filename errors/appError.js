
function AppError (errorType, errorMessage, errorCode, isOperational) {
  Error.call(this)
  Error.captureStackTrace(this)
  this.type = errorType
  this.message = errorMessage
  // status code to throw(if any).
  this.code = errorCode
  // true, when our app throws an error intentionally, e.g.: Missing some input
  this.isOperational = isOperational
  this.time = new Date()
}

module.exports = { AppError }
