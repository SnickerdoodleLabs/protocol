import {
  NetworkUnreachableError,
  InsufficientFundsError,
} from "@objects/errors/index.js";
import { BlockchainErrorMessage } from "@objects/primitives/BlockchainErrorMessage.js";

export class BlockchainErrorMapper {
  protected static blockchainErrorMapping = new Map<
    BlockchainErrorMessage,
    (error: unknown | null) => TBlockchainCommonErrors
  >([
    [
      BlockchainErrorMessage("could not detect network"),
      (error: unknown | null) =>
        new NetworkUnreachableError(
          BlockchainErrorMessage("Could not detect network"),
          error,
        ),
    ],
    [
      BlockchainErrorMessage(
        "insufficient funds for intrinsic transaction cost",
      ),
      (error: unknown | null) =>
        new InsufficientFundsError(
          BlockchainErrorMessage("Insufficient funds to send transaction"),
          error,
        ),
    ],
    [
      BlockchainErrorMessage("sender doesn't have enough funds to send tx"),
      (error: unknown | null) =>
        new InsufficientFundsError(
          BlockchainErrorMessage("Insufficient funds to send transaction"),
          error,
        ),
    ],
  ]);

  public static buildBlockchainError<TGenericError>(
    error,
    generateGenericError: (
      msg: string,
      reason: string | undefined,
      e: unknown,
    ) => TGenericError,
  ): TBlockchainCommonErrors | TGenericError {
    const errorReason = error?.reason;
    const errorInitializer = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(errorReason),
    );

    if (errorInitializer != null) {
      return errorInitializer?.(error);
    }

    return generateGenericError(error?.message, errorReason, error);
  }
}

export type TBlockchainCommonErrors =
  | NetworkUnreachableError
  | InsufficientFundsError;
