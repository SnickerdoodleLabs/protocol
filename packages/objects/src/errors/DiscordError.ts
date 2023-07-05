import errorCodes from "@objects/errors/errorCodes.js";
import { OAuthError } from "@objects/errors/OAuthError.js";

export class DiscordError extends OAuthError {
  protected errorCode: string = errorCodes[DiscordError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
