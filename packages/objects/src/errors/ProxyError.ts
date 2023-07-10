import errorCodes from "@objects/errors/errorCodes.js";

export class ProxyError extends Error {
  protected errorCode: string = errorCodes[ProxyError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
