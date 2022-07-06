import errorCodes from "@objects/errors/errorCodes";

export class QueryFormatError extends Error {
    protected errorCode: string = errorCodes[QueryFormatError.name];
    constructor(message?: string, public src?: unknown) {
        super(message);
    }
}
