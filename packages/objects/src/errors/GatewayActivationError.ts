import errorCodes from "@objects/errors/errorCodes";

export class GatewayActivationError extends Error {
  protected errorCode: string = errorCodes[GatewayActivationError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
