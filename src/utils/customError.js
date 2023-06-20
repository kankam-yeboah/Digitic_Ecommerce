export default class CustomError extends Error {
  constructor(error_message, error_code, options) {
    super(error_message);
    this.statusCode = error_code;
    this.status = error_code >= 400 && error_code < 500 ? "fail" : "error";
    this.options = options;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
