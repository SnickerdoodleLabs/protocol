import "reflect-metadata";
import { ExtensionCore } from "@implementations/ExtensionCore";
import { URLString } from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";

interface IConfig {
  apiUrl: URLString;
}

const init = async () => {
  let config: IConfig = {
    apiUrl: URLString("https://insight-api.dev.snickerdoodle.dev"),
  };
  try {
    const _config = await Browser.storage.local.get("SD_TEST_CONFIG");
    if (_config.SD_TEST_CONFIG) {
      const configObj: Partial<IConfig> = JSON.parse(_config.SD_TEST_CONFIG);
      config = { ...config, ...configObj };
    }
  } catch {
  } finally {
    // init with config
    new ExtensionCore();
  }
};

init();
