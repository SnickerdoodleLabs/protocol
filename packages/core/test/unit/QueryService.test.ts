/*
Andrew Strimaitis
Unit Testing for Blockchain Listener - Pull-JSON-from-IPFS and Parse-JSON


2 classes:
  1. EVMService
  2. EVMServiceMocks
2 interfaces: 
  1. IEVMRepository
  2. IEVMService
*/
import "reflect-metadata";
import {
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { ContextProviderMock } from "../mock/utilities";

import { dataWalletAddress, dataWalletKey } from "@core-tests/mock/mocks";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
const sdqlQuery = new SDQLQuery(queryId, queryContent);

class QueryServiceMocks {
  public queryParsingEngine: IQueryParsingEngine;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;

  public constructor() {
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();

    td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(
      okAsync(sdqlQuery),
    );

    td.when(
      this.consentContractRepo.isAddressOptedIn(
        consentContractAddress,
        EVMAccountAddress(dataWalletAddress),
      ),
    ).thenReturn(okAsync(true));
  }

  public factory(): IQueryService {
    return new QueryService(
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      this.contextProvider,
    );
  }
}
describe("Query Service tests", () => {
  test("onQueryPosted() golden path", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const service = mocks.factory();
    // Act
    const result = await service.onQueryPosted(consentContractAddress, queryId);

    // Assert
    // run the test - did it pass?
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });
  });
});
