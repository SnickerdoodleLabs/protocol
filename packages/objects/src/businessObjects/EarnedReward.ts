import { IpfsCID } from "@objects/primitives";

export enum ERewardType {
  LAZY = 0,
  MINTED = 1,
  WEB2 = 2,
}

export interface EarnedReward {
  queryCID: IpfsCID;
  type: ERewardType;
}
