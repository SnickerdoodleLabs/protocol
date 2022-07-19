import "reflect-metadata";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  EVMAccountAddress,
  IDataWalletPersistence,
  IEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import * as CovalentAvaxResponse from "@indexers-test/mock/CovalentResponse_AVAX_EndTime";
import * as CovalentEthResponse from "@indexers-test/mock/CovalentResponse_ETH_NoEnd";
import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository";
import { IIndexerConfig } from "@indexers/IIndexerConfig";
import { IIndexerConfigProvider } from "@indexers/IIndexerConfigProvider";

const chainId = ChainId(1337);
const accountAddress = EVMAccountAddress("0xPhoebe");
const startTime = new Date(123456);

class CovalentEVMTransactionRepositoryMocks {
  public configProvider = td.object<IIndexerConfigProvider>();
  public ajaxUtils = td.object<IAxiosAjaxUtils>();

  public config: IIndexerConfig = {
    covalentApiKey: "CovalentApiKey",
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

  public factoryService(): IEVMTransactionRepository {
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
});
