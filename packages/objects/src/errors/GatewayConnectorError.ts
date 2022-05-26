/**
 * GatewayConnectorError is a generic error type, that simply means
 * that the operation failed inside the gateway iframe for some reason.
 * We got a response, which will be recorded in the error.
 */

import errorCodes from "@objects/errors/errorCodes";

export class GatewayConnectorError extends Error {
  protected errorCode: string = errorCodes[GatewayConnectorError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
