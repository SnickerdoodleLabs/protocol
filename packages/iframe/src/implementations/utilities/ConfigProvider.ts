import {
  ChainId,
  DomainName,
  LanguageCode,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { IFrameConfig } from "@core-iframe/interfaces/objects";
import { IConfigProvider } from "@core-iframe/interfaces/utilities/index";

declare const __CONTROL_CHAIN_ID__: string;
declare const __IPFS_FETCH_BASE_URL__: URLString;
declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: IFrameConfig;

  public constructor() {
    this.config = new IFrameConfig(
      ChainId(Number(__CONTROL_CHAIN_ID__)),
      __IPFS_FETCH_BASE_URL__,
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      // Get the source domain
      DomainName(document.location.ancestorOrigins[0]),
      LanguageCode("en"), // This may come in from the URL
    );
  }
  getConfig(): IFrameConfig {
    return this.config;
  }
}