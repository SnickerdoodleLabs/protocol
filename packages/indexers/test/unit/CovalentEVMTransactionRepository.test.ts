import "reflect-metadata";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import { ECurrencyCode } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import * as CovalentAvaxResponse from "@indexers-test/mock/CovalentResponse_AVAX_EndTime";
import * as CovalentBalanceResponse from "@indexers-test/mock/CovalentResponse_ETH_Balances";
import * as CovalentEthResponse from "@indexers-test/mock/CovalentResponse_ETH_NoEnd";
import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository";
import { IIndexerConfig } from "@indexers/IIndexerConfig";
import { IIndexerConfigProvider } from "@indexers/IIndexerConfigProvider";

class CovalentEVMTransactionRepositoryMocks {
  public configProvider = td.object<IIndexerConfigProvider>();
  public ajaxUtils = td.object<IAxiosAjaxUtils>();

  public config: IIndexerConfig = {
    covalentApiKey: "CovalentApiKey",
    moralisApiKey: "MoralisApiKey",
    quoteCurrency: ECurrencyCode.USD,
    supportedChains: [],
    etherscanApiKey: "EtherscanApiKey",
    alchemyKeys: new Map(),
  };

  constructor(public responseRepo) {
    td.when(this.configProvider.getConfig()).thenReturn(okAsync(this.config));
    td.when(
      this.ajaxUtils.get(
        td.matchers.argThat((url: URL) => {
          return (
            responseRepo.getExpectedURL(this.config.covalentApiKey) ==
            url.toString()
          );
        }),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(responseRepo.response));
  }

  public factoryService(): CovalentEVMTransactionRepository {
    return new CovalentEVMTransactionRepository(
      this.configProvider,
      this.ajaxUtils,
    );
  }
}

describe("CovalentEVMTransactionRepository tests", () => {
  test("getEVMTransactions() with no end time should succeed", async () => {
    // Arrange
    const mocks = new CovalentEVMTransactionRepositoryMocks(
      CovalentEthResponse,
    );
    const repo = mocks.factoryService();

    // Act
    const response = await repo.getEVMTransactions(
      CovalentEthResponse.chainId,
      CovalentEthResponse.accountAddress,
      CovalentEthResponse.startTime,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const transactions = response._unsafeUnwrap();
    expect(transactions.length).toBe(12);
  });

  test("getEVMTransactions() with end time should succed", async () => {
    // Arrange
    const mocks = new CovalentEVMTransactionRepositoryMocks(
      CovalentAvaxResponse,
    );
    const repo = mocks.factoryService();

    // Act
    const response = await repo.getEVMTransactions(
      CovalentAvaxResponse.chainId,
      CovalentAvaxResponse.accountAddress,
      CovalentAvaxResponse.startTime,
      CovalentAvaxResponse.endTime,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const transactions = response._unsafeUnwrap();
    expect(transactions.length).toBe(9);
  });

  test("getBalancesForAccount() should run successfully", async () => {
    // Arrange
    const mocks = new CovalentEVMTransactionRepositoryMocks(
      CovalentBalanceResponse,
    );
    const repo = mocks.factoryService();

    // Act
    const response = await repo.getBalancesForAccount(
      CovalentBalanceResponse.chainId,
      CovalentBalanceResponse.accountAddress,
    );
  });
});
