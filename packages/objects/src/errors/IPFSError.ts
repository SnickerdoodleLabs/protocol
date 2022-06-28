import { BaseError } from "@objects/errors/BaseError";
import errorCodes from "./errorCodes";

export class IPFSError extends BaseError {
    protected errorCode: string = errorCodes[IPFSError.name];
    constructor(msg: string, src: unknown | null) {
        super(msg, 500, errorCodes[IPFSError.name], src, true);
    }
}
