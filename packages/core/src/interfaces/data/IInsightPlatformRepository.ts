import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EVMContractAddress,
  Signature,
  TokenId,
  DomainName,
  DataWalletAddress,
  HexString,
  EVMAccountAddress,
  EVMPrivateKey,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BusinessConsentContract } from "@core/interfaces/objects";

export interface IInsightPlatformRepository {
  claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, AjaxError>;

  deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    signature: Signature,
    insights: Insight[]): ResultAsync<void, AjaxError>;

  getBusinessConsentContracts(): ResultAsync<
    BusinessConsentContract[],
    AjaxError
  >;

  acceptInvitation(
    dataWalletAddress: DataWalletAddress,
    invitation: CohortInvitation,
    signature: Signature,
  ): ResultAsync<void, AjaxError>;

  leaveCohort(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    signature: Signature,
  ): ResultAsync<void, AjaxError>;

  getTXTRecords(domainName: DomainName): ResultAsync<string[], AjaxError>;

  executeMetatransaction(
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
