import {
  ChainId,
  DomainName,
  LanguageCode,
  URLString,
} from "@snickerdoodlelabs/objects";

export class IFrameConfig {
  public constructor(
    public controlChainId: ChainId,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public sourceDomain: DomainName,
    public languageCode: LanguageCode,
  ) {}
}
