// Các Status Code Error
const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}

// Lý do cho các Status Code
const ReasonStatusCode = {
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
}

class ErrorResponse extends Error {
    // Error => name, message, stack => Kế thừa status và message
    constructor(message, status) {
        console.log(`[3]::Throw BadRequestError`);
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends  ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends  ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        console.log(`[2]::Throw BadRequestError`);
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}