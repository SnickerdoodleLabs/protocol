import errorCodes from "@objects/errors/errorCodes";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError";

export class TransactionUnsupportedOperationError extends Error {
  protected errorCode: string =
    errorCodes[TransactionUnsupportedOperationError.name];
  constructor(message?: string, public src?: ProviderRpcError | unknown) {
    super(
      `${message} ${
        (src as any)?.data?.message ? `: ${(src as any)?.data?.message}` : ``
      }`,
    );
  }
}
