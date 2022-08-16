import "reflect-metadata";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  DataWalletAddress,
  EligibleReward,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  SDQLQuery,
  SDQLString,
  Signature,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { insightDeliveryTypes } from "@snickerdoodlelabs/signature-verification";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import td from "testdouble";

import {
  dataWalletAddress,
  testCoreConfig,
  dataWalletKey,
} from "@core-tests/mock/mocks";
import {
  ContextProviderMock,
  ConfigProviderMock,
} from "@core-tests/mock/utilities";
import { avalance1SchemaStr } from "@core-tests/unit/business/query/avalanche1.data";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data";
import {
  CoreConfig,
  CoreContext,
  InsightString,
} from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
// const sdqlQuery = new SDQLQuery(queryId, queryContent);

const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalance1SchemaStr));

const insights: InsightString[] = [
  InsightString("Hello1"),
  InsightString("Hello2"),
];
const insightsError: InsightString[] = [InsightString("Ajax Error producer")];
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
    this.cryptoUtils = td.object<ICryptoUtils>();

    td.when(
      this.insightPlatformRepo.deliverInsights(
        td.matchers.anything(),
        consentContractAddress,
        queryId,
        td.matchers.anything(),
        JSON.stringify(insights),
      ),
    ).thenReturn(okAsync(0).map((result) => {})); // success

    td.when(
      this.insightPlatformRepo.deliverInsights(
        td.matchers.anything(),
        consentContractAddress,
        queryId,
        td.matchers.anything(),
        JSON.stringify(insightsError),

        // )).thenReturn({}); // success
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

    td.when(this.queryParsingEngine.handleQuery(sdqlQuery)).thenReturn(
      okAsync([insights, rewards]),
    );

    td.when(
      this.cryptoUtils.signTypedData(
        testCoreConfig.snickerdoodleProtocolDomain,
        insightDeliveryTypes,
        td.matchers.anything(),
        dataWalletKey,
      ),
    ).thenReturn(okAsync(Signature("My signature")));

    // td.when(this.queryParsingEngine.handleQuery(sdqlQuery)).thenReturn(
    //   okAsync([insights, rewards])
    // );
  }

  public factory(): QueryService {
    return new QueryService(
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

  test("test signable", async () => {
    await mocks.contextProvider.getContext().then((result) => {
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const context = result.value;
        expect(context.dataWalletAddress).toBe(dataWalletAddress);
        const signable = queryService.createSignable(
          context,
          consentContractAddress,
          queryId,
          returns,
        );
        expect(signable["queryId"]).toEqual(queryId);
        expect(signable["consentContractId"]).toEqual(consentContractAddress);
        expect(signable["dataWallet"]).toEqual(dataWalletAddress);
        expect(signable["returns"]).toEqual(JSON.stringify(insights));
      }
    });
  });

  // test("no error if dataWallet and address are present", async () => {
  //   await ResultUtils.combine([
  //     mocks.contextProvider.getContext(),
  //     mocks.configProvider.getConfig(),
  //   ]).andThen(([context, config]) => {
  //     const res = queryService.validateContextConfig(
  //       context as CoreContext,
  //       config as CoreConfig,
  //     );
  //     expect(res).toBeNull();
  //     return okAsync(true);
  //   });
  // });

  test("error if dataWalletAddress missing in context", async () => {
    await ResultUtils.combine([
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      const copyContext: CoreContext = { ...(context as CoreContext) };
      copyContext.dataWalletAddress = null;
      const res = queryService.validateContextConfig(
        copyContext,
        config as CoreConfig,
      );
      expect(res).toBeInstanceOf(UninitializedError);
      return okAsync(true);
    });
  });

  test("error if dataWallet missing in context", async () => {
    await ResultUtils.combine([
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      const copyContext: CoreContext = { ...(context as CoreContext) };
      copyContext.dataWalletKey = null;
      const res = queryService.validateContextConfig(
        copyContext,
        config as CoreConfig,
      );
      expect(res).toBeInstanceOf(UninitializedError);
      return okAsync(true);
    });
  });

  test("deliverInsights success", async () => {
    mocks.contextProvider
      .getContext()
      .andThen((context) => {
        // const copyContext:CoreContext = {...(context as CoreContext)};
        // copyContext.dataWalletKey = mocks.dataWalletKey;
        // copyContext.dataWalletAddress = mocks.dataWalletAddress;

        return queryService.deliverInsights(
          context,
          testCoreConfig,
          consentContractAddress,
          queryId,
          insights,
        );
      })
      .then((result) => {
        // console.log('result', result);
        expect(result.isOk()).toBeTruthy();
      });

    // expect(r).toBeUndefined();
  });

  test("deliverInsights fail", async () => {
    ResultUtils.combine([
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ])
      .andThen(([context, config]) => {
        // (context as CoreContext).dataWalletKey = mocks.dataWalletKey;
        // (context as CoreContext).dataWalletAddress = mocks.dataWalletAddress;

        return queryService.deliverInsights(
          context as CoreContext,
          config as CoreConfig,
          consentContractAddress,
          queryId,
          insightsError,
        );
      })
      .then((result) => {
        // console.log('result', result);
        expect(result.isErr()).toBeTruthy();
      });
  });

  test("processQuery success", async () => {
    // const queryRequest = new SDQLQueryRequest(consentContractAddress, sdqlQuery);
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context
    // queryService.
    // copyContext.dataWalletKey = null;

    await queryService
      .processQuery(consentContractAddress, sdqlQuery)
      .andThen((result) => {
        console.log("result", result);
        expect(result).toBeUndefined();
        // expect(result.isOk()).toBeTruthy();
        return okAsync(true);
      });
    // await queryService
    //   .processQuery(consentContractAddress, sdqlQuery)
    //   .then((result) => {
    //     console.log('result', result);
    //     expect(result.isOk()).toBeTruthy();
    //   });
  });
});
