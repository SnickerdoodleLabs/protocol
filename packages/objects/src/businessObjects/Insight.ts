import { IpfsCID, URLString } from "@objects/primatives";

export class Insight {
  public constructor(
    public queryId: IpfsCID,
    public destinationUrl: URLString,
    public data: number[],
  ) {}
}
