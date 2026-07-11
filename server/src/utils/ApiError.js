class ApiError {
  constructor(statusCode, message, errors = []) {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export default ApiError;