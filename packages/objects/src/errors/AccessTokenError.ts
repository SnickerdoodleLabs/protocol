import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class AccessTokenError extends BaseError {
    protected errorCode: string = errorCodes[AccessTokenError.name];
    constructor(
        message: string,
        public statusCode: number,
        public src?: unknown,
    ) {
        super(message, 500, errorCodes[AccessTokenError.name], src, false);
    }
}
