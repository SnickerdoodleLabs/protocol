import { BlockchainProviderError } from "@objects/errors/blockchain/BlockchainProviderError.js";
import { ExecutionRevertedError } from "@objects/errors/blockchain/ExecutionRevertedError.js";
import { GasTooLowError } from "@objects/errors/blockchain/GasTooLowError.js";
import { InsufficientFundsError } from "@objects/errors/blockchain/InsufficientFundsError.js";
import { InvalidAddressError } from "@objects/errors/blockchain/InvalidAddressError.js";
import { InvalidArgumentError } from "@objects/errors/blockchain/InvalidArgumentError.js";
import { InvalidNonceError } from "@objects/errors/blockchain/InvalidNonceError.js";
import { MissingArgumentError } from "@objects/errors/blockchain/MissingArgumentError.js";
import { NetworkUnreachableError } from "@objects/errors/blockchain/NetworkUnreachableError.js";
import { SignerUnavailableError } from "@objects/errors/blockchain/SignerUnavailableError.js";
import { UnexpectedArgumentError } from "@objects/errors/blockchain/UnexpectedArgumentError.js";
import { UnknownBlockchainError } from "@objects/errors/blockchain/UnknownBlockchainError.js";

export type BlockchainTransactionErrors =
  | UnknownBlockchainError
  | InsufficientFundsError
  | InvalidArgumentError
  | MissingArgumentError
  | UnexpectedArgumentError
  | GasTooLowError
  | InvalidAddressError
  | ExecutionRevertedError
  | InvalidNonceError;

export type BlockchainCommonErrors =
  | BlockchainProviderError
  | NetworkUnreachableError
  | SignerUnavailableError
  | BlockchainTransactionErrors;
