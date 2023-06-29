import { URLString } from "@objects/primitives/index.js";

export interface IOpenSeaMetadata {
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
}
