import {
  AdKey,
  DataPermissions,
  InsightKey,
  IpfsCID,
  QueryFormatError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import {
  IQueryObjectFactory,
  IQueryObjectFactoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
  SDQLParser,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/index.js";
import {
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/query/index.js";
import { IQueryFactories } from "@core/interfaces/utilities/factory/index.js";
import {
  IAdDataRepository,
  IAdDataRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class QueryFactories implements IQueryFactories {
  constructor(
    @inject(IQueryObjectFactoryType)
    readonly queryObjectFactory: IQueryObjectFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
    @inject(IQueryRepositoryType)
    readonly queryRepository: IQueryRepository,
    @inject(IAdDataRepositoryType)
    readonly adRepo: IAdDataRepository,
  ) {}

  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser {
    const SDQLWrapper = this.queryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, schemaString),
    );
    return new SDQLParser(cid, SDQLWrapper, this.queryObjectFactory);
  }

  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError> {
    try {
      const SDQLWrapper = this.queryWrapperFactory.makeWrapper(
        new SDQLQuery(cid, schemaString),
      );
      return okAsync(new SDQLParser(cid, SDQLWrapper, this.queryObjectFactory));
    } catch (e) {
      return errAsync(new QueryFormatError((e as Error).message));
    }
  }

  makeFullAstEvaluator(
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): AST_Evaluator {
    return new AST_Evaluator(
      undefined,
      cid,
      this.queryRepository,
      this.adRepo,
      dataPermissions,
    );
  }

  makeAstEvaluatorForCompensations(
    baseTruth: (AdKey | InsightKey)[]
  ): AST_Evaluator {
    return new AST_Evaluator(
      baseTruth
    );
  }
}
