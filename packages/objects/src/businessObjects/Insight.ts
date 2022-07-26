import { IpfsCID, URLString } from "@objects/primitives";

export class Insight {
  // public constructor(
  //   public queryId: IpfsCID,
  //   public destinationUrl: URLString,
  //   public data: number[],
  // ) {}
  public constructor(
    public key: string,
    public data: string,
  ) {}
}
