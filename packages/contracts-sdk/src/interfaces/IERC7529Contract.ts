import { BlockchainCommonErrors, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects/index.js";

export interface IERC7529Contract<T> extends IBaseContract {
  addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  getDomains(): ResultAsync<DomainName[], BlockchainCommonErrors | T>;
}
