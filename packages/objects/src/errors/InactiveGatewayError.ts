import errorCodes from "@objects/errors/errorCodes";

export class InactiveGatewayError extends Error {
  protected errorCode: string = errorCodes[InactiveGatewayError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
