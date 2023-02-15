import errorCodes from "@objects/errors/errorCodes";
import { OAuthError } from "@objects/errors/OAuthError";

export class DiscordError extends OAuthError {
  protected errorCode: string = errorCodes[DiscordError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
