import "reflect-metadata";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import { IBaseContract } from "@snickerdoodlelabs/contracts-sdk";
import { EVMContractAddress } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { BaseContractWrapper } from "@core/implementations/utilities/factory/index.js";
import { ContextProviderMock } from "@core-tests/mock/utilities";

const contractAddress = EVMContractAddress("ContractAddress");

class TestContract extends BaseContractWrapper<IBaseContract> {
  public testFallback(
    primaryError = false,
    secondaryError = false,
  ): ResultAsync<void, Error> {
    return this.fallback(
      () => {
        if (primaryError) {
          return errAsync(new Error("Primary Error"));
        }
        return okAsync(undefined);
      },
      () => {
        if (secondaryError) {
          return errAsync(new Error("Secondary Error"));
        }
        return okAsync(undefined);
      },
    );
  }
}

class BaseContractWrapperMocks {
  public primaryProvider = td.object<IBaseContract>();
  public secondaryProvider: IBaseContract | null;
  public contextProvider = new ContextProviderMock();
  public logUtils = td.object<ILogUtils>();

  constructor(createSecondary: boolean) {
    td.when(this.primaryProvider.getContractAddress()).thenReturn(
      contractAddress as never,
    );

    this.secondaryProvider = null;
    if (createSecondary) {
      this.secondaryProvider = td.object<IBaseContract>();
      td.when(this.secondaryProvider.getContractAddress()).thenReturn(
        contractAddress as never,
      );
    }
  }

  public factory(): TestContract {
    return new TestContract(
      this.primaryProvider,
      this.secondaryProvider,
      this.contextProvider,
      this.logUtils,
    );
  }
}

describe("BaseContractWrapper tests", () => {
  test("primary succeeds, no secondary call made", async () => {
    // Arrange
    const mocks = new BaseContractWrapperMocks(true);
    const wrapper = mocks.factory();

    // Act
    const result = await wrapper.testFallback();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({ onApiAccessed: 1 });
  });

  test("primary fails, secondary call made", async () => {
    // Arrange
    const mocks = new BaseContractWrapperMocks(true);
    const wrapper = mocks.factory();

    // Act
    const result = await wrapper.testFallback(true, false);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({ onApiAccessed: 2 });
  });

  test("primary fails, no secondary exists", async () => {
    // Arrange
    const mocks = new BaseContractWrapperMocks(false);
    const wrapper = mocks.factory();

    // Act
    const result = await wrapper.testFallback(true, false);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({ onApiAccessed: 1 });
  });

  test("primary fails, secondary fails", async () => {
    // Arrange
    const mocks = new BaseContractWrapperMocks(true);
    const wrapper = mocks.factory();

    // Act
    const result = await wrapper.testFallback(true, true);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({ onApiAccessed: 2 });
  });
});
