import { IpfsCID } from "@objects/primitives";

export class MarketplaceListing {
  public constructor(public cids: IpfsCID[], public nextHead: number) {}
}
