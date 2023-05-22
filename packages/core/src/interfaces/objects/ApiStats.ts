import { EExternalApi, UnixTimestamp } from "@snickerdoodlelabs/objects";

export class ApiStats {
  public constructor(
    public api: EExternalApi,
    public totalCalls: number,
    public timestamps: UnixTimestamp[],
  ) {}
}
