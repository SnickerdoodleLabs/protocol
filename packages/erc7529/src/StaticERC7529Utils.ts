import { AxiosAjaxUtils, LogUtils } from "@snickerdoodlelabs/common-utils";
import { URLString } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { ERC7529Config } from "@erc7529/ERC7529Config";
import { ERC7529Utils } from "@erc7529/ERC7529Utils.js";
import { IERC7529ConfigProvider } from "@erc7529/IERC7529ConfigProvider.js";

class ERC7529ConfigProvider implements IERC7529ConfigProvider {
  protected config = new ERC7529Config(
    URLString("https://cloudflare-dns.com/dns-query"),
  );

  public getConfig(): ResultAsync<ERC7529Config, never> {
    return okAsync(this.config);
  }
}

const ajaxUtils = new AxiosAjaxUtils();
const configProvider = new ERC7529ConfigProvider();
const logUtils = new LogUtils();

export const staticUtils = new ERC7529Utils(
  ajaxUtils,
  configProvider,
  logUtils,
);
