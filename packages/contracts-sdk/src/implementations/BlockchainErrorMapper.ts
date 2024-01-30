/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  InvalidNonceError,
  JSONString,
  BlockchainCommonErrors,
  BlockchainProviderError,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

export class BlockchainErrorMapper {
  protected static blockchainErrorMapping = new Map<
    string,
    (
      message: string,
      transaction: ethers.Transaction | undefined,
      srcErr: unknown | null,
    ) => BlockchainCommonErrors
  >([
    [
      "could not detect network",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) => new NetworkUnreachableError("Could not detect network", srcErr),
    ],
    [
      "insufficient funds for intrinsic transaction cost",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new InsufficientFundsError(
          `Insufficient funds to send transaction: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "sender doesn't have enough funds to send tx",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new InsufficientFundsError(
          `Insufficient funds to send transaction: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "resolver or addr is not configured for ENS name",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new InvalidArgumentError(
          `Address argument is invalid (format or type): ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "invalid arrayify value",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) => new InvalidArgumentError(message, srcErr, transaction!),
    ],
    [
      "missing argument: passed to contract",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new MissingArgumentError(
          `Missing arguments for contract function call: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "too many arguments: passed to contract",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new UnexpectedArgumentError(
          `Too many arguments for contract function call: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "intrinsic gas too low",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new GasTooLowError(
          `Insufficient gas provided to function call: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "invalid address",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new InvalidAddressError(
          `Invalid address provided as argument to create contract instance: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "execution reverted",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) =>
        new ExecutionRevertedError(
          `Function hits a revert message on the contract: ${message}`,
          srcErr,
          transaction!,
        ),
    ],
    [
      "nonce has already been used",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) => {
        return new InvalidNonceError(
          `Nonce has already been used: ${message}`,
          srcErr,
          transaction!,
        );
      },
    ],
    [
      "nonce too high",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) => {
        return new InvalidNonceError(
          `Nonce too high: ${message}`,
          srcErr,
          transaction!,
        );
      },
    ],
    [
      "nonce too low",
      (
        message: string,
        transaction: ethers.Transaction | undefined,
        srcErr: unknown | null,
      ) => {
        return new InvalidNonceError(
          `Nonce too low: ${message}`,
          srcErr,
          transaction!,
        );
      },
    ],
  ]);

  public static buildErrorFromProviderError(
    chain: EChain,
    error: Error,
  ): BlockchainCommonErrors {
    return new BlockchainProviderError(chain, error.message, error);
  }

  // Repeating this pattern for each error type is not ideal, but it's the only way to get the type safety we want
  public static buildBlockchainError(
    error: IEthersContractError,
  ): BlockchainCommonErrors;

  public static buildBlockchainError<TGenericError>(
    error: IEthersContractError,
    generateGenericError?: (
      msg: string,
      err: IEthersContractError,
      transaction?: ethers.Transaction,
    ) => TGenericError,
  ): BlockchainCommonErrors | TGenericError;

  public static buildBlockchainError<TGenericError>(
    error: IEthersContractError,
    generateGenericError?: (
      msg: string,
      err: IEthersContractError,
      transaction?: ethers.Transaction,
    ) => TGenericError,
  ): BlockchainCommonErrors | TGenericError {
    // First check if error message is a ProviderError as some errors are triggered at the provider level rather than contract level
    try {
      let providerError;

      // if (error?.name == "ProviderError") {
      //   providerError = this.getSpecificProviderError(error);
      // }

      // Get the deepest error in the chain, that should have the most reliable error
      const deepestError = BlockchainErrorMapper.getDeepestError(error);
      const deepestTransaction =
        BlockchainErrorMapper.getDeepestTransaction(error);

      // Determining the error message is a bit tricky, as it can be in different places depending on the error type
      let errorMessage = "Generic error message, no better message found";
      try {
        if (deepestError.body != null) {
          const body = JSON.parse(
            deepestError.body,
          ) as IJsonRPCProviderResponse;

          errorMessage = body.error.message;
        } else {
          errorMessage = deepestError.message;
        }
      } catch (e) {
        // Can't parse the body
        errorMessage = deepestError.message;
      }

      const errorInitializerFromMessage = this.blockchainErrorMapping.get(
        this.getErrorKey(errorMessage),
      );

      if (errorInitializerFromMessage != null) {
        return errorInitializerFromMessage(
          errorMessage,
          deepestTransaction,
          error,
        );
      }

      // If all above are null, then we don't know what the error is
      if (generateGenericError != null) {
        return generateGenericError(errorMessage, error, deepestTransaction);
      }

      return new UnknownBlockchainError(errorMessage, deepestTransaction!);
    } catch (e: unknown) {
      return new UnknownBlockchainError(
        `Error occurred while running buildBlockchainError ${e}`,
        e,
      );
    }
  }

  protected static getErrorKey(errorString: string | undefined): string {
    errorString = errorString?.toLowerCase() || "";
    Array.from(this.blockchainErrorMapping.keys()).forEach((key) => {
      if (errorString?.includes(key.toLowerCase())) {
        errorString = key;
      }
    });

    return errorString;
  }

  public static getSpecificProviderError(error): string | null {
    // ProviderError has the following properties : [ 'parent', 'name', '_stack', 'code', '_isProviderError', 'data' ]
    // The error message is within the '_stack' property
    // Search for a specific error text and return it if found,
    if (error._stack.includes("intrinsic gas too low")) {
      return "intrinsic gas too low";
    }

    // If no match is found, .includes() will return false, we do not recognize the type ProviderError and return null so that it can be captured as a generic error
    return null;
  }

  // Used to defeat .toString() on Error objects and get the actual goods.
  private static printError(error: IEthersContractError): void {
    console.log("Printing error data");
    console.log("message:", error.message);
    console.log("code:", error.code);
    console.log("body:", error.body);
    console.log("error:", error.error == null ? "No Error" : "Deeper Error");
    console.log("requestMethod:", error.requestMethod);
    console.log("url:", error.url);
    console.log("transaction:", error.transaction);
  }

  // This is a recursive function that will return the deepest error in the error chain
  // or itself if it is the deepest error
  private static getDeepestError(
    error: IEthersContractError,
  ): IEthersContractError {
    if (error.error == null) {
      return error;
    }
    return BlockchainErrorMapper.getDeepestError(error.error);
  }

  private static getDeepestTransaction(
    error: IEthersContractError,
    currentTransaction?: ethers.Transaction,
  ): ethers.Transaction | undefined {
    // If the current error has a transaction, then it's deeper than the current one.
    if (error.transaction != null) {
      // If there's nothing deeper, we have the transaction
      if (error.error == null) {
        return error.transaction;
      }

      // We have a transaction, but there's a deeper error to check
      return BlockchainErrorMapper.getDeepestTransaction(
        error.error,
        error.transaction,
      );
    }

    // No current transaction, but check if there's a deeper error to check
    if (error.error != null) {
      return BlockchainErrorMapper.getDeepestTransaction(
        error.error,
        currentTransaction,
      );
    }
    // Nothing deeper to check, no current transaction, return whatever we were given
    return currentTransaction;
  }
}

// This is an actual exception type thrown by ethers.js
export interface IEthersContractError {
  message: string;
  code: string;
  body?: JSONString;
  error?: IEthersContractError;
  requestMethod?: string;
  url?: string;
  transaction?: ethers.Transaction;
}

// This is the format of the data in the "body" field above. It's a JSON-RPC response
interface IJsonRPCProviderResponse {
  jsonrpc: string;
  id: number;
  result: string;
  error: IJsonRPCProviderError;
}

interface IJsonRPCProviderError {
  code: number;
  message: string;
  data: IJsonRPCProviderErrorData;
}

interface IJsonRPCProviderErrorData {
  message: string;
}
