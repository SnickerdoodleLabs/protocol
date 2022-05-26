import errorCodes from "@objects/errors/errorCodes";

export class GatewayValidationError extends Error {
  protected errorCode: string = errorCodes[GatewayValidationError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
