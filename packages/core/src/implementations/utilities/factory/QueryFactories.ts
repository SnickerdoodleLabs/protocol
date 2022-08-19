import { IpfsCID } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { AST_Evaluator, SDQLParser } from "@core/implementations/business";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { AST, SDQLSchema } from "@core/interfaces/objects";

@injectable()
export class QueryFactories {
  makeParser(cid: IpfsCID, schemaString: string): SDQLParser {
    const schema = SDQLSchema.fromString(schemaString);
    return new SDQLParser(cid, schema);
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
