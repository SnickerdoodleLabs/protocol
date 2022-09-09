import {
  IpfsCID,
  SDQLString,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  IQueryObjectFactory,
  IQueryObjectFactoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
  SDQLParser,
  SDQLQueryWrapper,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business/index.js";
import { IQueryRepository } from "@core/interfaces/business/utilities/index.js";
import { IQueryFactories } from "@core/interfaces/utilities/factory";

@injectable()
export class QueryFactories implements IQueryFactories {
  constructor(
    @inject(IQueryObjectFactoryType)
    readonly queryObjectFactory: IQueryObjectFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
  ) {}

  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser {
    const schema = this.queryWrapperFactory.makeWrapper(schemaString);
    return new SDQLParser(cid, schema, this.queryObjectFactory);
  }

  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError> {
    try {
      const schema = this.queryWrapperFactory.makeWrapper(schemaString);
      return okAsync(new SDQLParser(cid, schema, this.queryObjectFactory));
    } catch (e) {
      return errAsync(new QueryFormatError((e as Error).message));
    }
  }

  makeAstEvaluator(
    cid: IpfsCID,
    ast: AST | null,
    queryRepository: IQueryRepository,
  ): AST_Evaluator {
    const astEvaluator = new AST_Evaluator(cid, ast, queryRepository);
    // astEvaluator.postConstructor();
    return astEvaluator;
  }
}
