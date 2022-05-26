import errorCodes from "@objects/errors/errorCodes";

export class RouterChannelUnknownError extends Error {
  protected errorCode: string = errorCodes[RouterChannelUnknownError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
