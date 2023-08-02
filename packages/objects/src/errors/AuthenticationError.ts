import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class AuthenticationError extends BaseError {
    protected errorCode: string = errorCodes[AuthenticationError.name];
    constructor(message: string, public src?: unknown) {
        super(message, 500, errorCodes[AuthenticationError.name], src, false);
    }
}
