import {
  ChainId,
  DomainName,
  LanguageCode,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";

export class IFrameConfig {
  public constructor(
    public controlChainId: ChainId,
    public devChainProviderURL: ProviderUrl | undefined = undefined,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public sourceDomain: DomainName,
    public languageCode: LanguageCode,
  ) {}
}
