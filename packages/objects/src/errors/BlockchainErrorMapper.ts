import {
  NetworkUnreachableError,
  InsufficientFundsError,
  InvalidArgumentError,
  MissingArgumentError,
  UnexpectedArgumentError,
  UnknownBlockchainError,
  GasTooLowError,
  InvalidAddressError,
  ExecutionRevertedError,
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
    [
      BlockchainErrorMessage("instrinsic gas too low"),
      (error: unknown | null) =>
        new GasTooLowError(
          BlockchainErrorMessage("Insufficient gas provided to function call"),
          error,
        ),
    ],
    [
      BlockchainErrorMessage("invalid address"),
      (error: unknown | null) =>
        new InvalidAddressError(
          BlockchainErrorMessage("Invalid address provided as argument"),
          error,
        ),
    ],
    [
      BlockchainErrorMessage("execution reverted"),
      (error: unknown | null) =>
        new ExecutionRevertedError(
          BlockchainErrorMessage(
            "Function hits a revert message on the contract",
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
    // First check if error message is a ProviderError as some errors are triggered at the provider level rather than contract level
    let providerError;

    if (error?.name == "ProviderError") {
      providerError = this.getSpecificProviderError(error);
    }

    let errorReason = error?.reason;
    const errorMessage = error?.message || error?.msg;

    if (errorReason != null) {
      // If there is a reason property, check if it has the text execution reverted
      // This means that the error hit the contract specific revert message
      if (errorReason.search("execution reverted")) {
        errorReason = "execution reverted";
      }
    }

    const errorInitializerFromProviderError = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(providerError),
    );

    const errorInitializerFromReason = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(errorReason),
    );

    const errorInitializerFromMessage = this.blockchainErrorMapping.get(
      BlockchainErrorMessage(errorMessage),
    );

    if (errorInitializerFromProviderError != null) {
      return errorInitializerFromProviderError?.(error);
    }

    if (errorInitializerFromReason != null) {
      return errorInitializerFromReason?.(error);
    }

    if (errorInitializerFromMessage != null) {
      return errorInitializerFromMessage?.(error);
    }

    // If all above are null, then we don't know what the error is
    if (generateGenericError != null) {
      return generateGenericError(errorMessage, errorReason, error);
    }

    return new UnknownBlockchainError(errorReason || errorMessage, error);
  }

  public static getSpecificProviderError(error): BlockchainErrorMessage | null {
    // ProviderError has the following properties : [ 'parent', 'name', '_stack', 'code', '_isProviderError', 'data' ]
    // The error message is within the '_stack' property
    // Search for a specific error text and return it if found,
    if (error._stack.search("intrinsic gas too low") >= 0) {
      return BlockchainErrorMessage("instrinsic gas too low");
    }

    // If no match is found, .search() will return -1, we do not recognize the type ProviderError and return null so that it can be captured as a generic error
    return null;
  }
}

export type TBlockchainCommonErrors =
  | UnknownBlockchainError
  | NetworkUnreachableError
  | InsufficientFundsError
  | InvalidArgumentError
  | MissingArgumentError
  | UnexpectedArgumentError
  | GasTooLowError
  | InvalidAddressError
  | ExecutionRevertedError;
