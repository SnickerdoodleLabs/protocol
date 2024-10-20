import {
  ChainId,
  DomainName,
  IApiKeys,
  LanguageCode,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";

export class IFrameConfig {
  public constructor(
    public controlChainId: ChainId,
    public devChainProviderURL: ProviderUrl | null = null,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public sourceDomain: DomainName,
    public languageCode: LanguageCode,
    public portfolioPollingIntervalMS: number,
    public nftPollingIntervalMS: number,
    public transactionPollingIntervalMS: number,
    public backupPollingIntervalMS: number,
    public requestForDataPollingIntervalMS: number,
    public defaultKeys: IApiKeys,
  ) {}
}
