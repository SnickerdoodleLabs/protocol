import errorCodes from "@objects/errors/errorCodes";

export class MessagingError extends Error {
  protected errorCode: string = errorCodes[MessagingError.name];
  constructor(message?: string, protected src?: unknown) {
    super(message);
  }
}
