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

import { exampleCovalentResponse } from "@indexers-test/mock/CovalentResponse";
import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository";
import { IIndexerConfig } from "@indexers/IIndexerConfig";
import { IIndexerConfigProvider } from "@indexers/IIndexerConfigProvider";

const chainId = ChainId(1337);
const accountAddress = EVMAccountAddress("0xPhoebe");
const startTime = new Date(123456);

class CovalentEVMTransactionRepositoryMocks {
  public configProvider = td.object<IIndexerConfigProvider>();
  public persistence = td.object<IDataWalletPersistence>();
  public ajaxUtils = td.object<IAxiosAjaxUtils>();

  public config: IIndexerConfig = {
    covalentApiKey: "CovalentApiKey",
  };

  // {
  //   method: "get",
  //   url: `https://api.covalenthq.com/v1/${chainId.toString()}/address/${accountAddress}/transactions_v2/?key=${
  //     config.covalentApiKey
  //   }&match=${primer}`,
  //   headers: {},
  // }

  constructor() {
    td.when(this.configProvider.getConfig()).thenReturn(okAsync(this.config));
    td.when(
      this.ajaxUtils.get(td.matchers.anything(), td.matchers.anything()),
    ).thenReturn(okAsync(exampleCovalentResponse));
    // td.when(this.fooRepo.getNumber()).thenReturn(okAsync(1));
  }

  public factoryService(): IEVMTransactionRepository {
    return new CovalentEVMTransactionRepository(
      this.configProvider,
      this.persistence,
      this.ajaxUtils,
    );
  }
}

describe("CovalentEVMTransactionRepository tests", () => {
  test("getEVMTransactions() should succeed", async () => {
    // Arrange
    const mocks = new CovalentEVMTransactionRepositoryMocks();
    const repo = mocks.factoryService();

    // Act
    const response = await repo.getEVMTransactions(
      chainId,
      accountAddress,
      startTime,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const transactions = response._unsafeUnwrap();
    expect(transactions.length).toBe(16);
  });
});
