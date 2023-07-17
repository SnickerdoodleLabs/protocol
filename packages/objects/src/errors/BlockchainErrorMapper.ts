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

export class BlockchainErrorMapper {
  protected static blockchainErrorMapping = new Map<
    string,
    (error: unknown | null) => TBlockchainCommonErrors
  >([
    [
      "could not detect network",
      (error: unknown | null) =>
        new NetworkUnreachableError("Could not detect network", error),
    ],
    [
      "insufficient funds for intrinsic transaction cost",
      (error: unknown | null) =>
        new InsufficientFundsError(
          "Insufficient funds to send transaction",
          error,
        ),
    ],
    [
      "sender doesn't have enough funds to send tx",
      (error: unknown | null) =>
        new InsufficientFundsError(
          "Insufficient funds to send transaction",
          error,
        ),
    ],
    [
      "resolver or addr is not configured for ENS name",
      (error: unknown | null) =>
        new InvalidArgumentError(
          "Address argument is invalid (format or type)",
          error,
        ),
    ],
    [
      "missing argument: passed to contract",
      (error: unknown | null) =>
        new MissingArgumentError(
          "Missing arguments for contract function call",
          error,
        ),
    ],
    [
      "too many arguments: passed to contract",
      (error: unknown | null) =>
        new UnexpectedArgumentError(
          "Too many arguments for contract function call",
          error,
        ),
    ],
    [
      "intrinsic gas too low",
      (error: unknown | null) =>
        new GasTooLowError("Insufficient gas provided to function call", error),
    ],
    [
      "invalid address",
      (error: unknown | null) =>
        new InvalidAddressError(
          "Invalid address provided as argument to create contract instance",
          error,
        ),
    ],
    [
      "execution reverted",
      (error: unknown | null) =>
        new ExecutionRevertedError(
          "Function hits a revert message on the contract",
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
    let errorMessage = error?.message || error?.msg;

    const errorInitializerFromProviderError = this.blockchainErrorMapping.get(
      this.getErrorKey(providerError),
    );

    const errorInitializerFromReason = this.blockchainErrorMapping.get(
      this.getErrorKey(errorReason),
    );

    const errorInitializerFromMessage = this.blockchainErrorMapping.get(
      this.getErrorKey(errorMessage),
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

  protected static getErrorKey(errorString: string): string {
    errorString = errorString.toLowerCase();
    Array.from(this.blockchainErrorMapping.keys()).forEach((key) => {
      if (errorString?.includes(key.toLocaleLowerCase())) {
        errorString = key;
      }
    });

    return errorString;
  }

  public static getSpecificProviderError(error): string | null {
    // ProviderError has the following properties : [ 'parent', 'name', '_stack', 'code', '_isProviderError', 'data' ]
    // The error message is within the '_stack' property
    // Search for a specific error text and return it if found,
    if (error._stack.search("intrinsic gas too low") >= 0) {
      return "intrinsic gas too low";
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
