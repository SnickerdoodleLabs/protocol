import { IpfsCID, SDQLString } from "@snickerdoodlelabs/objects";
import { AST_Evaluator, SDQLParser } from "@core/implementations/business";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { AST } from "@core/interfaces/objects";
import { ResultAsync } from "neverthrow";
import { QueryFormatError } from "@snickerdoodlelabs/objects";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser;
  makePerserAsync(cid: IpfsCID, schemaString: SDQLString): ResultAsync<SDQLParser, QueryFormatError>;
  makeAstEvaluator(
    cid: IpfsCID,
    ast: AST | null,
    queryRepository: IQueryRepository,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
