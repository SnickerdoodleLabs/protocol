import { IpfsCID } from "@objects/IpfsCID";
import { URLString } from "@objects/URLString";

export class Insight {
  public constructor(
    public queryId: IpfsCID,
    public destinationUrl: URLString,
    public data: number[],
  ) {}
}
