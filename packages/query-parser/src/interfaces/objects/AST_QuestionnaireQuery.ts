import {
  DataPermissions,
  EQuestionnaireQuestionType,
  ESDQLQueryReturn,
  EWalletDataType,
  ISDQLQueryClause,
  ISDQLTimestampRange,
  IpfsCID,
  MissingWalletDataTypeError,
  Questionnaire,
  SDQL_Name,
  SDQL_OperatorName,
  Web2QueryTypes,
  web2QueryTypes,
} from "@snickerdoodlelabs/objects";
import { Result, err, ok } from "neverthrow";
import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";
export class AST_QuestionnaireQuery extends AST_SubQuery {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param property - the name of the query from the schema, e.g., "age"
   */
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn.Object,
    readonly questionnaireIndex?: IpfsCID,
    readonly questionnaire?: Questionnaire,
  ) {
    super(name, returnType);
  }

  static fromSchema(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_QuestionnaireQuery {
    return new AST_QuestionnaireQuery(
      name,
      ESDQLQueryReturn.Object,
      schema.cid,
    );
  }

  getPermission(): Result<IpfsCID, MissingWalletDataTypeError> {
    return ok(this.questionnaireIndex!);
  }
}
