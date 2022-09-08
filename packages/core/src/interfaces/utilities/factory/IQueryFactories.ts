import {
  IpfsCID,
  SDQLString,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { AST_Evaluator, SDQLParser } from "@core/implementations/business/index.js";
import { IQueryRepository } from "@core/interfaces/business/utilities/index.js";
import { AST } from "@core/interfaces/objects/index.js";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser;
  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
  makeAstEvaluator(
    cid: IpfsCID,
    ast: AST | null,
    queryRepository: IQueryRepository,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
