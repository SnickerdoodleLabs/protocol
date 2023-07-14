import {
  NetworkUnreachableError,
  InsufficientFundsError,
  InvalidArgumentError,
  MissingArgumentError,
  UnexpectedArgumentError,
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
  | InsufficientFundsError
  | InvalidArgumentError
  | MissingArgumentError
  | UnexpectedArgumentError;
