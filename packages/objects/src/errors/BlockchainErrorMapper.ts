import {
  NetworkUnreachableError,
  InsufficientFundsError,
  InvalidArgumentError,
  MissingArgumentError,
  UnexpectedArgumentError,
  UnknownBlockchainError,
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
    [
      BlockchainErrorMessage("resolver or addr is not configured for ENS name"),
      (error: unknown | null) =>
        new InvalidArgumentError(
          BlockchainErrorMessage(
            "Address argument is invalid (format or type)",
          ),
          error,
        ),
    ],
    [
      BlockchainErrorMessage("missing argument: passed to contract"),
      (error: unknown | null) =>
        new MissingArgumentError(
          BlockchainErrorMessage(
            "Missing arguments for contract function call",
          ),
          error,
        ),
    ],
    [
      BlockchainErrorMessage("too many arguments: passed to contract"),
      (error: unknown | null) =>
        new UnexpectedArgumentError(
          BlockchainErrorMessage(
            "Too many arguments for contract function call",
          ),
          error,
        ),
    ],
  ]);

  // Repeating this pattern for each error type is not ideal, but it's the only way to get the type safety we want
  public static buildBlockchainError(error): TBlockchainCommonErrors;

  public static buildBlockchainError<TGenericError>(
    error,
    generateGenericError?: (
      msg: string,
      reason: string | undefined,
      err: unknown,
    ) => TGenericError,
  ): TBlockchainCommonErrors | TGenericError;

  public static buildBlockchainError<TGenericError>(
    error,
    generateGenericError?: (
      msg: string,
      reason: string | undefined,
      err: unknown,
    ) => TGenericError,
  ): TBlockchainCommonErrors | TGenericError {
    const errorReason = error?.reason;
    const errorMessage = error?.message || error?.msg;
    const errorInitializerFromReason = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(errorReason),
    );

    const errorInitializerFromMessage = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(errorMessage),
    );

    if (errorInitializerFromReason != null) {
      return errorInitializerFromReason?.(error);
    }

    if (errorInitializerFromMessage != null) {
      return errorInitializerFromMessage?.(error);
    }

    // If both are null, then we don't know what the error is
    if (generateGenericError != null) {
      return generateGenericError(errorMessage, errorReason, error);
    }

    return new UnknownBlockchainError(errorReason || errorMessage, error);
  }
}

export type TBlockchainCommonErrors =
  | UnknownBlockchainError
  | NetworkUnreachableError
  | InsufficientFundsError
  | InvalidArgumentError
  | MissingArgumentError
  | UnexpectedArgumentError;
