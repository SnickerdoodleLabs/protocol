import { Config } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";

export class ConfigProvider implements IConfigProvider {
  constructor() {}

  getConfig(): Config {
    return {} as Config;
  }
}
