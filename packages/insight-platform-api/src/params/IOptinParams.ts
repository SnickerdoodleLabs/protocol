import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  Signature,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IOptinParams {
  consentContractId: EVMContractAddress;
  signalNullifier: BigNumberString;
  queryCID: IpfsCID;
  insights: IQueryDeliveryItems;
  rewardParameters: IDynamicRewardParameter[];
  anonymitySetStart: number;
  anonymitySetSize: number;
  proof: ZKProof;
}
