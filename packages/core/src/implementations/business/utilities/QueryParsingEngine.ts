import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  InsightString,
  IpfsCID,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
  SDQL_Return,
  QueryIdentifier,
  ExpectedReward,
  ERewardType,
  IDynamicRewardParameter,
  ISDQLCompensations,
  CompensationId,
  AdKey,
  ISDQLAd,
  EligibleAd,
  EVMContractAddress,
  PersistenceError,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BaseOf } from "ts-brand";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/AST_Evaluator";
import {
  IQueryParsingEngine,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IQueryFactories,
  IQueryFactoriesType,
} from "@core/interfaces/utilities/factory/index.js";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ISDQLQueryUtilsType)
    protected queryUtils: ISDQLQueryUtils,
    @inject(IAdRepositoryType)
    protected adContentRepository: IAdContentRepository,
  ) {}

  public getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError> {
    const queryString = query.query;
    const cid: IpfsCID = query.cid;

    return this.queryUtils
      .filterQueryByPermissions(queryString, dataPermissions)
      .andThen((queryFilteredByPermissions) => {
        return this.constructAndSaveEligibleAds(
          queryFilteredByPermissions.eligibleAdsMap,
          cid,
          consentContractAddress,
        ).andThen(() => {
          const expectedRewardList = this.constructExpectedRewards(
            queryFilteredByPermissions.expectedCompensationsMap,
          );

          return okAsync<[QueryIdentifier[], ExpectedReward[]]>([
            queryFilteredByPermissions.permittedQueryIds,
            expectedRewardList,
          ]);
        });
      });
  }

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const rewards: EligibleReward[] = [];
    const schemaString = query.query;
    const cid: IpfsCID = query.cid;

    return this.queryFactories
      .makeParserAsync(cid, schemaString)
      .andThen((sdqlParser) => {
        return sdqlParser.buildAST();
      })
      .andThen((ast: AST) => {
        const astEvaluator = this.queryFactories.makeAstEvaluator(
          cid,
          ast,
          this.queryRepository,
        );

        return ResultUtils.combine(
          this.evalReturns(ast, dataPermissions, astEvaluator),
        ).andThen((insightResults) => {
          const insights = insightResults.map(this.SDQLReturnToInsightString);

          return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>(
            [insights, rewards],
          );
        });
      });
  }

  protected constructExpectedRewards(
    iSDQLCompensationsMap: Map<CompensationId, ISDQLCompensations>,
  ): ExpectedReward[] {
    const expectedRewardList: ExpectedReward[] = [];
    for (const currentKeyAsString in iSDQLCompensationsMap) {
      const currentSDQLCompensationsKey = CompensationId(currentKeyAsString);
      const currentSDQLCompensationsObject: ISDQLCompensations =
        iSDQLCompensationsMap[currentSDQLCompensationsKey];

      expectedRewardList.push(
        new ExpectedReward(
          currentSDQLCompensationsKey,
          currentSDQLCompensationsObject.description,
          currentSDQLCompensationsObject.chainId,
          JSON.stringify(currentSDQLCompensationsObject.callback),
          ERewardType.Direct,
        ),
      );
    }
    return expectedRewardList;
  }

  protected constructAndSaveEligibleAds(
    eligibleAdsMap: Map<AdKey, ISDQLAd>,
    queryCID: IpfsCID,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, PersistenceError> {
    const eligibleAdList = this.adsMapToEligibleAdObjects(
      eligibleAdsMap,
      queryCID,
      consentContractAddress,
    );

    return this.persistence.saveEligibleAds(eligibleAdList);
  }

  protected adsMapToEligibleAdObjects(
    iSDQLAdsMap: Map<AdKey, ISDQLAd>,
    queryCID: IpfsCID,
    consentContractAddress: EVMContractAddress,
  ): EligibleAd[] {
    const eligibleAdList: EligibleAd[] = [];
    for (const currentKeyAsString in iSDQLAdsMap) {
      const currentAdKey = AdKey(currentKeyAsString);
      const currentSDQLAdObject: ISDQLAd = iSDQLAdsMap[AdKey(currentAdKey)];

      eligibleAdList.push(
        new EligibleAd(
          consentContractAddress,
          queryCID,
          currentAdKey,
          currentSDQLAdObject.name,
          currentSDQLAdObject.content,
          currentSDQLAdObject.text,
          currentSDQLAdObject.displayType,
          currentSDQLAdObject.weight,
          currentSDQLAdObject.expiry,
          currentSDQLAdObject.keywords,
        ),
      );
    }
    return eligibleAdList;
  }

  protected SDQLReturnToInsightString(sdqlR: SDQL_Return): InsightString {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;

    if (typeof actualTypeData == "string") {
      return InsightString(actualTypeData);
    } else if (actualTypeData == null) {
      return InsightString("");
    } else {
      return InsightString(JSON.stringify(actualTypeData));
    }
  }

  private evalReturns(
    ast: AST,
    dataPermissions: DataPermissions,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<SDQL_Return, EvaluationError>[] {
    return [...ast.logic.returns.keys()].map((returnStr) => {
      const requiredPermissions = ast.logic.getReturnPermissions(returnStr);

      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator.evalAny(ast.logic.returns.get(returnStr));
      } else {
        return okAsync(SDQL_Return(null));
      }
    });
  }
}
