import { InsightKey, IpfsCID } from "@objects/primitives";

export class Insight {
  public constructor(public key: InsightKey, public data: string) {}
}
