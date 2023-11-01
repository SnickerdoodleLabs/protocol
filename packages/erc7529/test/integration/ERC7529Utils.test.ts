import "reflect-metadata";
import { AxiosAjaxUtils, LogUtils } from "@snickerdoodlelabs/common-utils";
import { ChainId, DomainName, URLString } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IERC7529ConfigProvider,
  ERC7529Config,
  ERC7529Utils,
} from "@erc7529/index.js";

const domainName = DomainName("cwssoftware.com");
const chainId = ChainId(1);

class ERC7529ConfigProvider implements IERC7529ConfigProvider {
  protected config = new ERC7529Config(
    URLString("https://cloudflare-dns.com/dns-query"),
  );

  public getConfig(): ResultAsync<ERC7529Config, never> {
    return okAsync(this.config);
  }
}

describe("ERC7529Utils Integration Tests", () => {
  test("getContractsFromDomain returns 5 contract addresses", async () => {
    // Arrange
    const ajaxUtils = new AxiosAjaxUtils();
    const configProvider = new ERC7529ConfigProvider();
    const logUtils = new LogUtils();

    const utils = new ERC7529Utils(ajaxUtils, configProvider, logUtils);

    // Act
    const result = await utils.getContractsFromDomain(domainName, chainId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const addresses = result._unsafeUnwrap();
    expect(addresses.length).toBe(5);
    expect(addresses.sort()).toEqual(
      [
        "0x3e6a2f0cba03d293b54c9fcf354948903007a701",
        "0x3e6a2f0cba03d293b54c9fcf354948903007a702",
        "0x3e6a2f0cba03d293b54c9fcf354948903007a798",
        "0x3e6a2f0cba03d293b54c9fcf354948903007a799",
        "0x3e6a2f0cba03d293b54c9fcf354948903007a700",
      ].sort(),
    );
  });
});
