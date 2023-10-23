import { URLString } from "@objects/primitives/index.js";

export interface IOldUserAgreement {
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
}
