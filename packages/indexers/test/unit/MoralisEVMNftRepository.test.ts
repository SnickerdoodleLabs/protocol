import "reflect-metadata";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import { okAsync } from "neverthrow";
import td from "testdouble";

import * as MoralisResponseSinglePage from "@indexers-test/mock/MoralisResponse_ETH_SinglePage";
import { IIndexerConfig } from "@indexers/IIndexerConfig";
import { IIndexerConfigProvider } from "@indexers/IIndexerConfigProvider";
import { MoralisEVMNftRepository } from "@indexers/MoralisEVMNftRepository";

class MoralisEVMNftRepositoryMocks {
  public configProvider = td.object<IIndexerConfigProvider>();
  public ajaxUtils = td.object<IAxiosAjaxUtils>();

  public config: IIndexerConfig = {
    covalentApiKey: "CovalentApiKey",
    moralisApiKey: "MoralisApiKey",
  };

  constructor(public responseRepo) {
    td.when(this.configProvider.getConfig()).thenReturn(okAsync(this.config));
    td.when(
      this.ajaxUtils.get(
        td.matchers.argThat((url: URL) => {
          return new URL(responseRepo.requestURL).pathname === url.pathname;
        }),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(responseRepo.response));
  }

  public factoryService(): MoralisEVMNftRepository {
    return new MoralisEVMNftRepository(this.configProvider, this.ajaxUtils);
  }
}

describe("MoralisEVMNftRepository tests", () => {
  test("getTokensForAccount() should succeed (single page)", async () => {
    // Arrange
    const mocks = new MoralisEVMNftRepositoryMocks(MoralisResponseSinglePage);
    const repo = mocks.factoryService();

    // Act
    const response = await repo.getTokensForAccount(
      MoralisResponseSinglePage.chainId,
      MoralisResponseSinglePage.accountAddress,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const nfts = response._unsafeUnwrap();
    expect(nfts.length).toBe(7);
  });
});
