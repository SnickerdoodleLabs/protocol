import errorCodes from "@objects/errors/errorCodes.js";

export class ProviderRpcError extends Error {
  protected errorCode: string = errorCodes[ProviderRpcError.name];
  constructor(public message: string, public code?: number, public data?: any) {
    super(message);
  }
}
