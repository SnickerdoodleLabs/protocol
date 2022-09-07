import {
  IpfsCID,
  SDQLString,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import {
  IQueryFactories,
} from "@core/interfaces/utilities/factory";
import { AST, IQueryObjectFactory, IQueryObjectFactoryType, SDQLParser, SDQLSchema } from "@snickerdoodlelabs/query-parser";

@injectable()
export class QueryFactories implements IQueryFactories {
  constructor(
    @inject(IQueryObjectFactoryType)
    readonly queryObjectFactory: IQueryObjectFactory,
  ) {}

  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser {
    const schema = SDQLSchema.fromString(SDQLString(schemaString));
    return new SDQLParser(cid, schema, this.queryObjectFactory);
  }

  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError> {
    try {
      const schema = SDQLSchema.fromString(schemaString);
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
