import {
  ChainId,
  DomainName,
  LanguageCode,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { IFrameConfig } from "@core-iframe/interfaces/objects";
import { IConfigProvider } from "@core-iframe/interfaces/utilities/index";

declare const __CONTROL_CHAIN_ID__: string;
declare const __IPFS_FETCH_BASE_URL__: URLString;
declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;
declare const __DEV_CHAIN_PROVIDER_URL__: ProviderUrl;
declare const __SUPPORTED_CHAINS__: string;
declare const __PORTFOLIO_POLLING_INTERVAL__: string;
declare const __TRANSACTION_POLLING_INTERVAL__: string;
declare const __BACKUP_POLLING_INTERVAL__: string;

const ONE_MINUTE_MS = 60000;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: IFrameConfig;

  public constructor() {
    this.config = new IFrameConfig(
      ChainId(Number(__CONTROL_CHAIN_ID__)),
      __DEV_CHAIN_PROVIDER_URL__,
      __SUPPORTED_CHAINS__.split(",").map((chain) => {
        return ChainId(Number.parseInt(chain));
      }),
      __IPFS_FETCH_BASE_URL__,
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      // Get the source domain
      DomainName(document.location.ancestorOrigins[0]),
      LanguageCode("en"), // This may come in from the URL
      typeof __PORTFOLIO_POLLING_INTERVAL__ !== "undefined" &&
      !!__PORTFOLIO_POLLING_INTERVAL__
        ? Number.parseInt(__PORTFOLIO_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // portfolioPollingIntervalMS
      typeof __TRANSACTION_POLLING_INTERVAL__ !== "undefined" &&
      !!__TRANSACTION_POLLING_INTERVAL__
        ? Number.parseInt(__TRANSACTION_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // transactionPollingIntervalMS
      typeof __BACKUP_POLLING_INTERVAL__ !== "undefined" &&
      !!__BACKUP_POLLING_INTERVAL__
        ? Number.parseInt(__BACKUP_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // backupPollingIntervalMS
    );
  }
  getConfig(): IFrameConfig {
    return this.config;
  }
}
