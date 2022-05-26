/**
 * GatewayAuthorizationDeniedError is thrown when the user will
 * not sign the gateway's signature, thereby authorizing the gateway's
 * code.
 * This is a fatal error for the gateway, and no retries should
 * be attempted.
 */

import errorCodes from "@objects/errors/errorCodes";

export class GatewayAuthorizationDeniedError extends Error {
  protected errorCode: string =
    errorCodes[GatewayAuthorizationDeniedError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
