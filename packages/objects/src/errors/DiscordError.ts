import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class DiscordError extends BaseError {
  protected errorCode: string = errorCodes[DiscordError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[DiscordError.name], src, false);
  }
}
