import errorCodes from "@objects/errors/errorCodes.js";

/**
 * This error is intended to represent any other error, but the error
 * was recieved via a proxy (iframe, injected from extension, etc.). It can be
 * very difficult to fully reconstruct the source error after passing over the
 * line, so most methods return this error. The source error is available in
 * the `src` property.
 */
export class ProxyError extends Error {
  protected errorCode: string = errorCodes[ProxyError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
