import {
  BigNumberString,
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  IQueryDeliveryItems,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  insights: IQueryDeliveryItems;
  rewardParameters: IDynamicRewardParameter[];
  signalNullifier: BigNumberString;
  anonymitySetStart: number;
  anonymitySetSize: number;
  proof: ZKProof;
}
