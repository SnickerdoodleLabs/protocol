import { LanguageCode, URLString } from "@snickerdoodlelabs/objects";
import { Signer } from "ethers";
import { injectable } from "inversify";

import { WebIntegrationConfig } from "@web-integration/interfaces/objects/index.js";
import { IConfigProvider } from "@web-integration/interfaces/utilities/index.js";

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: WebIntegrationConfig | null = null;

  public getConfig(): WebIntegrationConfig {
    if (this.config === null) {
      throw new Error("Config not set");
    }

    return this.config;
  }
  public setValues(signer: Signer | null, iframeUrl: URLString): void {
    this.config = new WebIntegrationConfig(
      signer,
      iframeUrl,
      LanguageCode("en"),
    );
  }
}
