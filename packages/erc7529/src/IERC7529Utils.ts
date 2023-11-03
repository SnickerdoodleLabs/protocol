import { IERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainCommonErrors,
  ChainId,
  DomainName,
  EChain,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IERC7529Utils {
  verifyContractForDomain<TContractErr>(
    contract: IERC7529Contract<TContractErr>,
    domain: DomainName,
    chainId: ChainId | EChain,
  ): ResultAsync<boolean, AjaxError | BlockchainCommonErrors | TContractErr>;

  getContractsFromDomain(
    domain: DomainName,
    chainId: ChainId | EChain,
  ): ResultAsync<EVMContractAddress[], AjaxError>;
}

export const IERC7529UtilsType = Symbol.for("IERC7529Utils");
