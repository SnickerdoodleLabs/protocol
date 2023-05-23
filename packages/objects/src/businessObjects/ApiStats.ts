import { EExternalApi } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class ApiStats {
  public constructor(
    public api: EExternalApi,
    public totalCalls: number,
    public timestamps: UnixTimestamp[],
  ) {}
}
