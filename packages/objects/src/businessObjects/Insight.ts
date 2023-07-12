import { IpfsCID, URLString } from "@objects/primitives/index.js";

export class Insight {
  // public constructor(
  //   public queryCID: IpfsCID,
  //   public destinationUrl: URLString,
  //   public data: number[],
  // ) {}
  public constructor(public key: string, public data: string) {}
}
