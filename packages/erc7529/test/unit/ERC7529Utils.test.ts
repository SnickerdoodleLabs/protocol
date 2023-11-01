import "reflect-metadata";
import { IAxiosAjaxUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { IERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  DomainName,
  EVMContractAddress,
  URLString,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";
import { urlJoinP } from "url-join-ts";

import {
  IERC7529ConfigProvider,
  ERC7529Config,
  IERC7529Utils,
  ERC7529Utils,
} from "@erc7529/index.js";

const domainName = DomainName("test.com");
const domainName2 = DomainName("test2.com");
const chainId = ChainId(43113);
const contractAddress1 = "0xc0ef9C60A036d5cA6BcB789BAd32A5f4D6749E9b";
const contractAddress2 = "0xInvalid";

class ERC7529UtilsMocks {
  public configProvider = td.object<IERC7529ConfigProvider>();
  public ajaxUtils = td.object<IAxiosAjaxUtils>();
  public logUtils = td.object<ILogUtils>();

  public erc7529Contract = td.object<IERC7529Contract<Error>>();

  public config = new ERC7529Config(
    URLString("https://test-dns-provider.com/dns-query"),
  );

  public constructor() {
    td.when(this.configProvider.getConfig()).thenReturn(okAsync(this.config));

    const url = new URL(
      urlJoinP(this.config.dnsProviderBaseUrl, [], {
        name: `erc-7529.${chainId}._domaincontracts.${domainName}`,
        type: "TXT",
      }),
    );
    const fullDomain = `erc-7529.${chainId}._domaincontracts.${domainName}`;

    td.when(
      this.ajaxUtils.get(
        td.matchers.argThat((arg) => {
          return url.toString() == arg.toString();
        }),
        {
          headers: { Accept: "application/dns-json" },
        },
      ),
    ).thenReturn(
      okAsync({
        Status: 0,
        TC: false,
        RD: true,
        RA: true,
        AD: false,
        CD: false,
        Question: [
          {
            name: fullDomain,
            type: 16,
          },
        ],
        Answer: [
          {
            name: fullDomain,
            type: 16,
            TTL: 300,
            data: `"${contractAddress1},0xc0ef9C60A036d5cA6BcB789BAd32A5f4D6749E9c"`,
          },
          {
            name: fullDomain,
            type: 16,
            TTL: 300,
            data: '"0xc0ef9C60A036d5cA6BcB789BAd32A5f4D6749E9d,0xc0ef9C60A036d5cA6BcB789BAd32A5f4D6749E9e"',
          },
        ],
      }),
    );

    td.when(this.erc7529Contract.getDomains()).thenReturn(
      okAsync([domainName]),
    );

    td.when(this.erc7529Contract.getContractAddress()).thenReturn(
      EVMContractAddress(contractAddress1) as never,
    );
  }

  public factory(): IERC7529Utils {
    return new ERC7529Utils(this.ajaxUtils, this.configProvider, this.logUtils);
  }
}

describe("ERC7529Utils tests", () => {
  test("getContractsFromDomain happy path", async () => {
    // Arrange
    const mocks = new ERC7529UtilsMocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.getContractsFromDomain(domainName, chainId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const addresses = result._unsafeUnwrap();
    expect(addresses.length).toBe(4);
  });

  test("verifyContractForDomain happy path", async () => {
    // Arrange
    const mocks = new ERC7529UtilsMocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.verifyContractForDomain(
      mocks.erc7529Contract,
      domainName,
      chainId,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });

  test("verifyContractForDomain fails when contract domain doesn't match", async () => {
    // Arrange
    const mocks = new ERC7529UtilsMocks();

    td.when(mocks.erc7529Contract.getDomains()).thenReturn(
      okAsync([domainName2]),
    );
    const utils = mocks.factory();

    // Act
    const result = await utils.verifyContractForDomain(
      mocks.erc7529Contract,
      domainName,
      chainId,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeFalsy();
  });
});
