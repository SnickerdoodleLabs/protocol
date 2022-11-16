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
  IDataWalletPersistence,
  IPFSError,
  SDQLQueryRequest,
  HexString32,
  EVMPrivateKey,
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
import {
  IConfigProvider,
  IDataWalletUtils,
} from "@core/interfaces/utilities/index.js";

const AndrewContractAddress = EVMContractAddress("Andrew");
const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
const derivedPrivateKey = EVMPrivateKey("derivedPrivateKey");
// const sdqlQuery = new SDQLQuery(queryId, queryContent);
const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalanche1SchemaStr));
const insights: InsightString[] = [
  InsightString("Hello1"),
  InsightString("Hello2"),
];
const insightsError: InsightString[] = [InsightString("Ajax Error producer")];
const rewards: EligibleReward[] = [];
const tokenId = TokenId(BigInt(0));

const allPermissions = HexString32(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
);

class QueryServiceMocks {
  public consentTokenUtils: IConsentTokenUtils;
  public dataWalletUtils: IDataWalletUtils;
  public queryParsingEngine: IQueryParsingEngine;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;
  public configProvider: IConfigProvider;
  public cryptoUtils: ICryptoUtils;
  public persistenceRepo: IDataWalletPersistence;

  public consentToken = new ConsentToken(
    consentContractAddress,
    EVMAccountAddress(dataWalletAddress),
    tokenId,
    DataPermissions.createWithAllPermissions(),
  );

  public constructor() {
    this.consentTokenUtils = td.object<IConsentTokenUtils>();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.persistenceRepo = td.object<IDataWalletPersistence>();
    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        tokenId,
        queryId,
        insights,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync([])); // success = EarnedReward[]
    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        tokenId,
        queryId,
        insightsError,
        derivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(errAsync(new AjaxError("mocked error"))); // error
    td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(
      okAsync(sdqlQuery),
    );
    td.when(
      this.consentContractRepo.isAddressOptedIn(consentContractAddress),
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
  }
  public factory(): QueryService {
    return new QueryService(
      this.consentTokenUtils,
      this.dataWalletUtils,
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      this.contextProvider,
      this.configProvider,
      this.cryptoUtils,
      this.persistenceRepo,
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
// describe("onQueryPosted tests", () => {
//   test("onQueryPosted: full run through", async () => {
//     const mocks = new QueryServiceMocks();
//     const contextMock = new ContextProviderMock();
//     const configMock = new ConfigProviderMock();
//     td.when(mocks.sdqlQueryRepo.getByCID(queryId)).thenReturn(
//       okAsync(sdqlQuery),
//     );
//     td.when(mocks.contextProvider.getContext()).thenReturn(
//       okAsync(td.matchers.anything()),
//     );
//     td.when(mocks.configProvider.getConfig()).thenReturn(
//       okAsync(td.matchers.anything()),
//     );
//     td.when(
//       mocks.consentContractRepo.isAddressOptedIn(
//         td.matchers.anything(),
//         td.matchers.anything(),
//       ),
//     ).thenReturn(okAsync(true));
//     td.when(
//       mocks.queryParsingEngine.getPreviews(
//         td.matchers.anything(),
//         td.matchers.anything(),
//       ),
//     ).thenReturn(okAsync([[], []]));
//     const queryService = mocks.factory(); // new context
//     const result = await queryService.onQueryPosted(
//       AndrewContractAddress,
//       queryId,
//     );
//     console.log("result", result);
//     expect(result).toBeDefined();
//   });
// });
describe("processRewardsPreview tests", () => {
  test("processRewardsPreview: full run through", async () => {
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context
    td.when(mocks.sdqlQueryRepo.getByCID(queryId)).thenReturn(
      okAsync(sdqlQuery),
    );
    td.when(mocks.contextProvider.getContext()).thenReturn(
      okAsync(
        new CoreContext(
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
        ),
      ),
    );
    td.when(mocks.configProvider.getConfig()).thenReturn(
      okAsync(
        new CoreConfig(
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
          td.matchers.anything(),
        ),
      ),
    );
    td.when(
      mocks.consentContractRepo.isAddressOptedIn(td.matchers.anything()),
    ).thenReturn(okAsync(true));
    td.when(
      mocks.queryParsingEngine.getPreviews(sdqlQuery, td.matchers.anything()),
    ).thenReturn(okAsync([[], []]));
    await ResultUtils.combine([
      mocks.sdqlQueryRepo.getByCID(queryId),
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
    ]).andThen(([query, context, config]) => {
      if (query == null) {
        return errAsync(
          new IPFSError(`CID ${queryId} is not yet visible on IPFS`),
        );
      }
      if (context.dataWalletAddress == null) {
        // Need to wait for the wallet to unlock
        return okAsync(undefined);
      }
      // We have the query, next step is check if you actually have a consent token for this business
      return mocks.consentContractRepo
        .isAddressOptedIn(consentContractAddress)
        .andThen((addressOptedIn) => {
          return mocks.queryParsingEngine.getPreviews(
            query,
            new DataPermissions(allPermissions),
          );
        })
        .andThen((rewardsPreviews) => {
          const queryRequest = new SDQLQueryRequest(
            consentContractAddress,
            query,
            [],
            [],
            null,
          );
          context.publicEvents.onQueryPosted.next(queryRequest);
          return okAsync(undefined);
        })
        .mapErr((err) => {
          expect(err.constructor).toBe(UninitializedError);
          return err;
        });
    });
  });
});
