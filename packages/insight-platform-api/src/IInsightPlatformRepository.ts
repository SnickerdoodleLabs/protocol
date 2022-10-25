import {
  AjaxError,
  BigNumberString,
  DataWalletAddress,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  InsightString,
  IpfsCID,
  Signature,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  // TODO: This is a placeholder for the rewards preview
  //   getRewardsPreview(
  //     dataWalletAddress: DataWalletAddress,
  //     consentContractAddress: EVMContractAddress,
  //     queryCid: IpfsCID,
  //     queries: string[],
  //     dataWalletKey: EVMPrivateKey,
  //   ): ResultAsync<void, AjaxError>;

  deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryCid: IpfsCID,
    returns: InsightString[],
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError>;

  executeMetatransaction(
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    value: BigNumberString,
    gas: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError>;

  isValidSignatureForInvitation(
    contractAddress: EVMContractAddress,
    tokenId: BigNumberString,
    bussinessSignature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<boolean, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
