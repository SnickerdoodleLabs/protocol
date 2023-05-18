import {
  DataPermissions,
  IpfsCID,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@query-parser/implementations/business/evaluators/AST_Evaluator.js";
import { SDQLParser } from "@query-parser/implementations/business/SDQLParser.js";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser;
  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
  makeAstEvaluator(
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
