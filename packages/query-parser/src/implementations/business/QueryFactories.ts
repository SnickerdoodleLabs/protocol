import {
  DataPermissions,
  IpfsCID,
  QueryFormatError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { AST_Evaluator } from "@query-parser/implementations/business/evaluators/AST_Evaluator.js";
import { SDQLParser } from "@query-parser/implementations/business/SDQLParser.js";
import {
  IQueryObjectFactory,
  IQueryObjectFactoryType,
  IQueryRepository,
  IQueryRepositoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/index.js";
import { IQueryFactories } from "@query-parser/interfaces/IQueryFactories.js";

@injectable()
export class QueryFactories implements IQueryFactories {
  constructor(
    @inject(IQueryObjectFactoryType)
    readonly queryObjectFactory: IQueryObjectFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
    @inject(IQueryRepositoryType)
    readonly queryRepository: IQueryRepository,
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

  makeAstEvaluator(
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): AST_Evaluator {
    return new AST_Evaluator(cid, this.queryRepository, dataPermissions);
  }
}
