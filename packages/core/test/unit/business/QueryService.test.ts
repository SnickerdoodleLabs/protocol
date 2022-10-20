import "reflect-metadata";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  EligibleReward,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  InsightString,
  SDQLQuery,
  SDQLString,
  UninitializedError,
  DataPermissions,
  ConsentToken,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { avalanche1SchemaStr } from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

import {
  dataWalletAddress,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";
import { QueryService } from "@core/implementations/business/index.js";
import {
  IConsentTokenUtils,
  IQueryParsingEngine,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data/index.js";
import { CoreConfig, CoreContext } from "@core/interfaces/objects/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
// const sdqlQuery = new SDQLQuery(queryId, queryContent);

const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalanche1SchemaStr));

const insights: InsightString[] = [
  InsightString("Hello1"),
  InsightString("Hello2"),
];
const insightsError: InsightString[] = [InsightString("Ajax Error producer")];
const rewards: EligibleReward[] = [];
const tokenId = TokenId(BigInt(0));

class QueryServiceMocks {
  public consentTokenUtils: IConsentTokenUtils;
  public queryParsingEngine: IQueryParsingEngine;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;
  public configProvider: IConfigProvider;
  public cryptoUtils: ICryptoUtils;

  public consentToken = new ConsentToken(
    consentContractAddress,
    EVMAccountAddress(dataWalletAddress),
    tokenId,
    DataPermissions.createWithAllPermissions(),
  );

  public constructor() {
    this.consentTokenUtils = td.object<IConsentTokenUtils>();
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.cryptoUtils = td.object<ICryptoUtils>();

    td.when(
      this.insightPlatformRepo.deliverInsights(
        dataWalletAddress,
        consentContractAddress,
        tokenId,
        queryId,
        insights,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined)); // success

    td.when(
      this.insightPlatformRepo.deliverInsights(
        dataWalletAddress,
        consentContractAddress,
        tokenId,
        queryId,
        insightsError,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(errAsync(new AjaxError("mocked error"))); // error

    td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(
      okAsync(sdqlQuery),
    );

    td.when(
      this.consentContractRepo.isAddressOptedIn(
        consentContractAddress,
        EVMAccountAddress(dataWalletAddress),
      ),
    ).thenReturn(okAsync(true));

    td.when(
      this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
    ).thenReturn(okAsync(this.consentToken));

    td.when(
      this.queryParsingEngine.handleQuery(
        sdqlQuery,
        DataPermissions.createWithAllPermissions(),
      ),
    ).thenReturn(okAsync([insights, rewards]));

    // td.when(this.queryParsingEngine.handleQuery(sdqlQuery)).thenReturn(
    //   okAsync([insights, rewards])
    // );
  }

  public factory(): QueryService {
    return new QueryService(
      this.consentTokenUtils,
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      this.contextProvider,
      this.configProvider,
      this.cryptoUtils,
    );
  }
}

describe("processQuery tests", () => {
  const mocks = new QueryServiceMocks();
  const queryService = mocks.factory();
  const returns = JSON.stringify(insights);

  test("error if dataWalletAddress missing in context", async () => {
    await ResultUtils.combine([
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      const copyContext: CoreContext = { ...(context as CoreContext) };
      copyContext.dataWalletAddress = null;
      return queryService
        .validateContextConfig(
          copyContext,
          config as CoreConfig,
          mocks.consentToken,
        )
        .andThen(() => {
          fail();
        })
        .orElse((err) => {
          expect(err.constructor).toBe(UninitializedError);
          return errAsync(err);
        });
    });
  });

  test("error if dataWallet missing in context", async () => {
    await ResultUtils.combine([
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      const copyContext: CoreContext = { ...(context as CoreContext) };
      copyContext.dataWalletKey = null;
      return queryService
        .validateContextConfig(
          copyContext,
          config as CoreConfig,
          mocks.consentToken,
        )
        .andThen(() => {
          fail();
        })
        .orElse((err) => {
          expect(err.constructor).toBe(UninitializedError);
          return errAsync(err);
        });
    });
  });

  test("processQuery success", async () => {
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context

    await queryService
      .processQuery(consentContractAddress, sdqlQuery)
      .andThen((result) => {
        //console.log("result", result);
        expect(result).toBeUndefined();
        // expect(result.isOk()).toBeTruthy();
        return okAsync(true);
      })
      .orElse((err) => {
        console.log(err);
        fail();
      });
  });
});
