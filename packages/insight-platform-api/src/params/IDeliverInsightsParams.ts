import {
  EVMContractAddress,
  IDynamicRewardParameter,
  InsightString,
  IpfsCID,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  tokenId: string;
  queryCID: IpfsCID;
  returns: InsightString[];
  rewardParameters: IDynamicRewardParameter[];
  signature: Signature;
}
