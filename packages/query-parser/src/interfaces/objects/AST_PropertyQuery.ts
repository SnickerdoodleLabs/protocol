import {
  ESDQLQueryReturn,
  EWalletDataType,
  ISDQLQueryClause,
  ISDQLTimestampRange,
  MissingWalletDataTypeError,
  SDQL_Name,
  SDQL_OperatorName,
  Web2QueryTypes,
} from "@snickerdoodlelabs/objects";
import { Result, err, ok } from "neverthrow";
import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";
import {
  BinaryCondition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
} from "@query-parser/interfaces/objects/condition/index.js";

export class AST_PropertyQuery extends AST_SubQuery {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param property - the name of the query from the schema, e.g., "age"
   */

  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn,
    readonly property: Web2QueryTypes,
    readonly conditions: Array<BinaryCondition>,
    // for reading gender
    readonly enum_keys?: Array<string>,
    readonly patternProperties?: Record<string, unknown>,
    readonly timestampRange?: ISDQLTimestampRange,
  ) {
    super(name, returnType);
  }
  static fromSchema(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_PropertyQuery {
    const conditions = AST_PropertyQuery.parseConditions(schema.conditions);

    return new AST_PropertyQuery(
      name,
      schema.return,
      schema.name as Web2QueryTypes,
      conditions,
      schema.enum_keys,
      schema.patternProperties,
      schema.timestampRange,
    );
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    switch (this.property) {
      case "age":
        return ok(EWalletDataType.Age);
      case "gender":
        return ok(EWalletDataType.Gender);
      case "givenName":
        return ok(EWalletDataType.GivenName);
      case "familyName":
        return ok(EWalletDataType.FamilyName);
      case "birthday":
        return ok(EWalletDataType.Birthday);
      case "email":
        return ok(EWalletDataType.Email);
      case "location":
        return ok(EWalletDataType.Location);
      case "url_visited_count":
        return ok(EWalletDataType.SiteVisits);
      case "chain_transactions":
        return ok(EWalletDataType.EVMTransactions);
      case "social_discord":
        return ok(EWalletDataType.Discord);
      case "social_twitter":
        return ok(EWalletDataType.Twitter);
      default:
        const missingWalletType = new MissingWalletDataTypeError(this.property);
        console.error(missingWalletType);
        return err(missingWalletType);
    }
  }

  static parseConditions(schema: any): Array<BinaryCondition> {
    const conditions = new Array<BinaryCondition>();

    for (const conditionName in schema) {
      const opName = SDQL_OperatorName(conditionName);
      const rightOperand = schema[conditionName];
      switch (conditionName) {
        case "g":
          conditions.push(new ConditionG(opName, null, Number(rightOperand)));
          break;
        case "ge":
          conditions.push(new ConditionGE(opName, null, Number(rightOperand)));
          break;
        case "l":
          conditions.push(new ConditionL(opName, null, Number(rightOperand)));
          break;
        case "le":
          conditions.push(new ConditionLE(opName, null, Number(rightOperand)));
          break;
        case "eq":
          conditions.push(new ConditionE(opName, null, Number(rightOperand)));
          break;
        case "in":
          conditions.push(
            new ConditionIn(
              opName,
              null,
              rightOperand as Array<string | number>,
            ),
          );
          break;
      }
    }

    return conditions;
  }
}
