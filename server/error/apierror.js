class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static Unauthorized(message) {
        return new ApiError(401, message)
    }

    static badRequest(message) {
        return new ApiError(404, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }
    static PreconditionFailed(message) {
        return new ApiError(412, message)
    }
}

module.exports = ApiError