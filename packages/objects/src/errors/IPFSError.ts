import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class IPFSError extends BaseError {
  protected errorCode: string = errorCodes[IPFSError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[IPFSError.name], src, false);
  }
}
