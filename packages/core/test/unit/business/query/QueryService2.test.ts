
import td from "testdouble";

import "reflect-metadata";
import { okAsync } from "neverthrow";
import { dataWalletAddress, dataWalletKey } from "@core-tests/mock/mocks";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IConsentContractRepository, IInsightPlatformRepository, ISDQLQueryRepository } from "@core/interfaces/data";
import { EligibleReward, EVMAccountAddress, EVMContractAddress, IpfsCID, SDQLQuery, SDQLString } from "@snickerdoodlelabs/objects";
import { ContextProviderMock } from "@core-tests/mock/utilities";
import { IQueryService } from "@core/interfaces/business";
import { QueryService } from "@core/implementations/business";
import { IConfigProvider } from "@core/interfaces/utilities";
import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { ConfigProviderMock } from "../../../mock/utilities/ConfigProviderMock";
import { InsightString } from "@core/interfaces/objects";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
const sdqlQuery = new SDQLQuery(queryId, queryContent);

const insights: InsightString[] = [InsightString("Hello1"), InsightString('Hello2')];
const rewards: EligibleReward[] = [];

class QueryServiceMocks {
  public queryParsingEngine: IQueryParsingEngine;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;
  public configProvider: IConfigProvider;
  public cryptoUtils: ICryptoUtils;

  public constructor() {
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.cryptoUtils = new CryptoUtils();

    // td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(
    //   okAsync(sdqlQuery),
    // );

    // td.when(
    //   this.consentContractRepo.isAddressOptedIn(
    //     consentContractAddress,
    //     EVMAccountAddress(dataWalletAddress),
    //   ),
    // ).thenReturn(okAsync(true));

    // td.when(this.queryParsingEngine.handleQuery(sdqlQuery)).thenReturn(
    //   okAsync([insights, rewards])
    // );
  }

  public factory(): IQueryService {
    return new QueryService(
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      this.contextProvider,
      this.configProvider,
      this.cryptoUtils
    );
  }
}

describe("processQuery tests", () => {

  const mocks = new QueryServiceMocks();
  const queryService = mocks.factory() as QueryService;

  test("test signable", () => {
    mocks.contextProvider.getContext().then((context) => {

      const signable = queryService.createSignable(consentContractAddress, queryId, context, insights);
      expect(signable["queryId"]).toEqual(queryId);
      expect(signable["consentContractId"]).toEqual(consentContractAddress);
      expect(signable["dataWallet"]).toEqual(dataWalletAddress);
      expect(signable["insights"]).toEqual(JSON.stringify(insights));

    });
    
  });
})
