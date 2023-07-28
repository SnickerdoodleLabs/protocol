import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ServerRewardError extends BaseError {
  protected errorCode: string = errorCodes[ServerRewardError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ServerRewardError.name], src, false);
  }
}
