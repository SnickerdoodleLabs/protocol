import { ChainId, URLString } from "@snickerdoodlelabs/objects";

export class IFrameConfig {
  public constructor(
    public controlChainId?: ChainId,
    public ipfsFetchBaseUrl?: URLString,
    public defaultInsightPlatformBaseUrl?: URLString,
  ) {}
}
