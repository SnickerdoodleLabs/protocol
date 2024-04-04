import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  QuestionnairesContractError,
  EVMContractAddress,
  IpfsCID,
  DomainName,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import {
  WrappedTransactionResponse,
  ContractOverrides,
  ContractsAbis,
} from "@contracts-sdk/interfaces/index.js";
import { IQuestionnairesContract } from "@contracts-sdk/interfaces/IQuestionnairesContract.js";

@injectable()
export class QuestionnairesContract
  extends ERC7529Contract<QuestionnairesContractError>
  implements IQuestionnairesContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected cryptoUtils: ICryptoUtils,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ConsentAbi.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getQuestionnaires(): ResultAsync<
    IpfsCID[],
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getQuestionnaires() as Promise<IpfsCID[]>,
      (e) => {
        return this.generateError(e, "Unable to call getQuestionnaires()");
      },
    );
  }

  public addQuestionnaire(
    questionnaireCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.writeToContract(
      "addQuestionnaire",
      [questionnaireCid],
      overrides,
    );
  }

  public removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.writeToContract("requestForData", [index], overrides);
  }

  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  > {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public getDomain(
    domain: DomainName,
  ): ResultAsync<
    boolean,
    QuestionnairesContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomain(domain) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call getDomain()");
      },
    );
  }

  public filters = {};

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): QuestionnairesContractError {
    return new QuestionnairesContractError(msg, e, transaction);
  }
}
