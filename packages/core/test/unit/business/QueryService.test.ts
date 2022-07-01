import "reflect-metadata";
import {
  ConsentContractError,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

import {
  consentContractAddress,
  queryId,
  SDQuery,
} from "@core-tests/mock/mocks";
import { ContextProviderMock } from "@core-tests/mock/utilities";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data";

class QueryServiceMocks {
  public queryParsingEngine = td.object<IQueryParsingEngine>();
  public ISDQLQueryRepository = td.object<ISDQLQueryRepository>();
  public insightPlatformRepository = td.object<IInsightPlatformRepository>();
  public consentContractRepository = td.object<IConsentContractRepository>();
  public contextProvider = new ContextProviderMock();

  constructor() {}

  public runSuccessScenarios() {
    td.when(this.ISDQLQueryRepository.getByCID([queryId])).thenReturn(
      okAsync(new Map([[queryId, SDQuery]])),
    );

    td.when(
      this.consentContractRepository.isAddressOptedIn(
        consentContractAddress,
        EVMAccountAddress(this.contextProvider.context.dataWalletAddress || ""),
      ),
    ).thenReturn(okAsync(true));
  }

  public runFailureScenarios() {
    td.when(this.ISDQLQueryRepository.getByCID([queryId])).thenReturn(
      okAsync(new Map([[queryId, SDQuery]])),
    );

    td.when(
      this.consentContractRepository.isAddressOptedIn(
        consentContractAddress,
        EVMAccountAddress(this.contextProvider.context.dataWalletAddress || ""),
      ),
    ).thenReturn(errAsync(new ConsentContractError()));
  }

  public factoryService(): IQueryService {
    //return {} as QueryService;
    return new QueryService(
      this.queryParsingEngine,
      this.ISDQLQueryRepository,
      this.insightPlatformRepository,
      this.consentContractRepository,
      this.contextProvider,
    );
  }
}

describe("QueryService tests", () => {
  test("onQueryPosted() should recieve a qurey and return void", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();
    mocks.runSuccessScenarios();
    const queryService = mocks.factoryService();
    console.log("queryService: ", queryService);

    // Action
    const res = await queryService.onQueryPosted(
      consentContractAddress,
      queryId,
    );

    // Assert
    expect(res.isErr()).toBeFalsy();
    expect(res._unsafeUnwrap()).toStrictEqual(undefined);
    mocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });
  });

  test("onQueryPosted() should return error", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();
    mocks.runFailureScenarios();
    const queryService = mocks.factoryService();

    // Action
    const res = await queryService.onQueryPosted(
      consentContractAddress,
      queryId,
    );

    // Assert
    expect(res.isErr()).toBeTruthy();
    expect(res._unsafeUnwrapErr()).toBeInstanceOf(ConsentContractError);
    mocks.contextProvider.assertEventCounts({ onQueryPosted: 0 });
  });
});
