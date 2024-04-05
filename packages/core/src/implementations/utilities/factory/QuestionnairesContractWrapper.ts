import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ContractOverrides,
  IQuestionnairesContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainCommonErrors,
  DomainName,
  EVMContractAddress,
  IpfsCID,
  QuestionnairesContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class QuestionnairesContractWrapper
  extends BaseContractWrapper<IQuestionnairesContract>
  implements IQuestionnairesContract
{
  public constructor(
    primary: IQuestionnairesContract,
    secondary: IQuestionnairesContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }

  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public getQuestionnaires(): ResultAsync<
    IpfsCID[],
    QuestionnairesContractError | BlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getQuestionnaires(),
      () => this.secondary?.getQuestionnaires(),
    );
  }

  public addQuestionnaire(
    ipfsCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.fallback(
      () => this.primary.addQuestionnaire(ipfsCid, overrides),
      () => this.secondary?.addQuestionnaire(ipfsCid, overrides),
    );
  }

  public removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.fallback(
      () => this.primary.removeQuestionnaire(index, overrides),
      () => this.secondary?.removeQuestionnaire(index, overrides),
    );
  }

  public addDomain(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.fallback(
      () => this.primary.addDomain(domain),
      () => this.secondary?.addDomain(domain),
    );
  }

  public removeDomain(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.fallback(
      () => this.primary.removeDomain(domain),
      () => this.secondary?.removeDomain(domain),
    );
  }

  public checkDomain(
    domain: DomainName,
  ): ResultAsync<
    boolean,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.fallback(
      () => this.primary.checkDomain(domain),
      () => this.secondary?.checkDomain(domain),
    );
  }
}
