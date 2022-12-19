import { IpfsCID } from "@snickerdoodlelabs/objects";

export class MarketplaceListing {
  public constructor(public cids: IpfsCID[], public nextHead: number) {}
}
