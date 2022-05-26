import errorCodes from "@objects/errors/errorCodes";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError";

export class TransactionTimeoutError extends Error {
  protected errorCode: string = errorCodes[TransactionTimeoutError.name];
  constructor(message?: string, public src?: ProviderRpcError | unknown) {
    super(
      `${message} ${
        (src as any)?.data?.message ? `: ${(src as any)?.data?.message}` : ``
      }`,
    );
  }
}
