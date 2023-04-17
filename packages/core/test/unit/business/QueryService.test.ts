import "reflect-metadata";
import {
  ICryptoUtils,
  ILogUtils,
  ITimeUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
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
  IPFSError,
  SDQLQueryRequest,
  HexString32,
  EVMPrivateKey,
  IDynamicRewardParameter,
  IInsights,
} from "@snickerdoodlelabs/objects";
import {
  avalanche1SchemaStr,
  ISDQLQueryWrapperFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

import { QueryService } from "@core/implementations/business/index.js";
import {
  IConsentTokenUtils,
  IQueryParsingEngine,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  ILinkedAccountRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data/index.js";
import { CoreConfig, CoreContext } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IDataWalletUtils,
} from "@core/interfaces/utilities/index.js";
import {
  dataWalletKey,
  dataWalletAddress,
  defaultInsightPlatformBaseUrl,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryCID = IpfsCID("Beep");
const derivedPrivateKey = EVMPrivateKey("derivedPrivateKey");
const sdqlQuery = new SDQLQuery(queryCID, SDQLString(avalanche1SchemaStr));
const insights = {
  queries: {},
  returns: {
    "if($q1and$q2)then$r1else$r2": InsightString("Hello1"),
    $r3: InsightString("Hello2"),
  },
} as IInsights;
const insightsError = {
  returns: {},
} as IInsights;
const rewards: EligibleReward[] = [];
const tokenId = TokenId(BigInt(0));

const allPermissions = HexString32(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
);
const dataPermissions = DataPermissions.createWithAllPermissions();

const rewardParameters = [
  {
    recipientAddress: {
      type: "address",
      value: "Phoebe",
    },
  } as IDynamicRewardParameter,
];

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
  public accountRepo: ILinkedAccountRepository;
  public timeUtils: ITimeUtils;
  public sdqlQueryWrapperFactory: ISDQLQueryWrapperFactory;
  public logUtils: ILogUtils;

  public consentToken = new ConsentToken(
    consentContractAddress,
    EVMAccountAddress(dataWalletAddress),
    tokenId,
    dataPermissions,
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
    this.accountRepo = td.object<ILinkedAccountRepository>();
    this.timeUtils = new TimeUtils();
    this.sdqlQueryWrapperFactory = new SDQLQueryWrapperFactory(this.timeUtils);
    this.logUtils = td.object<ILogUtils>();

    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        tokenId,
        queryCID,
        insights,
        rewardParameters,
        derivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync([])); // success = EarnedReward[]
    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        tokenId,
        queryCID,
        insightsError,
        rewardParameters,
        derivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(errAsync(new AjaxError("mocked error", 500))); // error

    td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID)).thenReturn(
      okAsync(sdqlQuery),
    );
    td.when(
      this.consentContractRepo.isAddressOptedIn(consentContractAddress),
    ).thenReturn(okAsync(true));
    td.when(
      this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
    ).thenReturn(okAsync(this.consentToken));
    td.when(
      this.queryParsingEngine.handleQuery(sdqlQuery, dataPermissions),
    ).thenReturn(okAsync(insights));

    td.when(
      this.dataWalletUtils.deriveOptInPrivateKey(
        consentContractAddress,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(derivedPrivateKey));
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
      this.accountRepo,
      this.sdqlQueryWrapperFactory,
      this.logUtils,
    );
  }
}

describe("processRewardsPreview tests", () => {
  test("processRewardsPreview: full run through", async () => {
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context
    td.when(mocks.sdqlQueryRepo.getSDQLQueryByCID(queryCID)).thenReturn(
      okAsync(sdqlQuery),
    ); // QQ: MAKES A LOT OF SENSE
    td.when(
      mocks.consentContractRepo.isAddressOptedIn(td.matchers.anything()),
    ).thenReturn(okAsync(true));
    td.when(
      mocks.queryParsingEngine.getPermittedQueryIdsAndExpectedRewards(
        sdqlQuery,
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync([[], []]));
    await ResultUtils.combine([
      mocks.sdqlQueryRepo.getSDQLQueryByCID(queryCID),
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
      //QQ: We just mocked sdqlQueryRepo.getByCID(queryId).
      // What's the point of checking if it's not null here?
    ]).andThen(([query, context, config]) => {
      if (query == null) {
        return errAsync(
          new IPFSError(`CID ${queryCID} is not yet visible on IPFS`),
        );
      }
      //QQ: We just mocked context
      // What's the point of checking if DW address is null here?
      if (context.dataWalletAddress == null) {
        // Need to wait for the wallet to unlock
        return okAsync(undefined);
      }
      // We have the query, next step is check if you actually have a consent token for this business
      return mocks.consentContractRepo
        .isAddressOptedIn(consentContractAddress)
        .andThen((addressOptedIn) => {
          return mocks.queryParsingEngine.getPermittedQueryIdsAndExpectedRewards(
            query,
            new DataPermissions(allPermissions),
            consentContractAddress,
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
