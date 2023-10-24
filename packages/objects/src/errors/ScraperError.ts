import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ScraperError extends BaseError {
  protected errorCode: string = errorCodes[ScraperError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ScraperError.name], src, false);
  }
}
