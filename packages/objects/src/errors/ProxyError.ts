/**
 * ProxyError is raised when a proxy can not be created or communication
 * can not be established. This is a fatal error for that proxy, but
 * retrying is still logical.
 */

import errorCodes from "@objects/errors/errorCodes";

export class ProxyError extends Error {
  protected errorCode: string = errorCodes[ProxyError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
