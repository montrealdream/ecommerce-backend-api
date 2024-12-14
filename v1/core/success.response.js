// Các Status Code Error
const StatusCode = {
    OK: 200,
    CREATED: 201,
}

// Lý do cho các Status Code
const ReasonStatusCode = {
    OK: "OK",
    CREATED: "Created",
}

class SuccessResponse {
    constructor ({ statusCode, reasonStatusCode, message, metadata = {} }) {
        console.log(`[2]::CREATED RESPONSE`);
        this.status = statusCode ? statusCode : StatusCode.OK;
        this.message = message ? message : ReasonStatusCode.OK;
        this.metadata = metadata;
    }

    send = (res) => {
        console.log(`[3]::CREATED RESPONSE`);
        return res.status(this.status).json( this );
    }
}

class OkResponse extends SuccessResponse {
    constructor ({
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        message = "",
    }) {

    }
}

class CreatedResponse extends SuccessResponse {
    constructor ({
        statusCode = StatusCode.CREATED,
        reasonStatusCode = ReasonStatusCode.CREATED,
        message = "",
        metadata = {}
    }) {
        console.log(`[1]::CREATED RESPONSE`);
        super({statusCode, reasonStatusCode, message, metadata});
    }
}

module.exports = {
    SuccessResponse,
    OkResponse,
    CreatedResponse
}