import { URLString } from "@objects/primitives";

export interface IOpenSeaMetadata {
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
}
