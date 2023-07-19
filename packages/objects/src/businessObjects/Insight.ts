import { InsightKey } from "@objects/primitives/index.js";

export class Insight {
  public constructor(public key: InsightKey, public data: string) {}
}
