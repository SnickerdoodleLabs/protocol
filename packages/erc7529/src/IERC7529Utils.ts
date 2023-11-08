import { IERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainCommonErrors,
  ChainId,
  DomainName,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IERC7529Utils {
  verifyContractForDomain<TContractErr>(
    contract: IERC7529Contract<TContractErr>,
    domain: DomainName,
    chainId: ChainId,
  ): ResultAsync<boolean, AjaxError | BlockchainCommonErrors | TContractErr>;

  getContractsFromDomain(
    domain: DomainName,
    chainId: ChainId,
  ): ResultAsync<EVMContractAddress[], AjaxError>;
}
