import { IpfsCID } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { AST_Evaluator, SDQLParser } from "@core/implementations/business";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { AST, SDQLSchema } from "@core/interfaces/objects";
import { IQueryObjectFactory, IQueryObjectFactoryType } from "@core/interfaces/utilities/factory";

@injectable()
export class QueryFactories {
  constructor(
    @inject(IQueryObjectFactoryType) 
    readonly queryObjectFactory: IQueryObjectFactory
  ) {}
  
  makeParser(cid: IpfsCID, schemaString: string): SDQLParser {

    const schema = SDQLSchema.fromString(schemaString);
    return new SDQLParser(cid, schema, this.queryObjectFactory);
    
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
