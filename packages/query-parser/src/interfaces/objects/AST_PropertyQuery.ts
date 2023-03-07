import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import {
  Condition,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
} from "@query-parser/interfaces/objects/condition/index.js";
import {
  ESDQLQueryReturn,
  EWalletDataType,
  MissingWalletDataTypeError,
  SDQL_Name,
  SDQL_OperatorName,
  Web2QueryTypes,
} from "@snickerdoodlelabs/objects";
import { err, ok, Result } from "neverthrow";

export class AST_PropertyQuery extends AST_Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param property - the name of the query from the schema, e.g., "age"
   */

  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn,
    readonly property: Web2QueryTypes,
    readonly conditions: Array<Condition>,
    // for reading gender
    readonly enum_keys: Array<string>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly patternProperties: Object,
  ) {
    super(name, returnType);
  }
  static fromSchema(name: SDQL_Name, schema: any): AST_PropertyQuery {
    const conditions = AST_PropertyQuery.parseConditions(schema.conditions);

    return new AST_PropertyQuery(
      name,
      schema.return,
      schema.name,
      conditions,
      schema.enum_keys,
      schema.patternProperties,
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
      case "browsing_history":
        return ok(EWalletDataType.SiteVisits);
      case "url_visited_count":
        return ok(EWalletDataType.SiteVisits);
      case "chain_transactions":
        return ok(EWalletDataType.EVMTransactions);
      default:
        const missingWalletType = new MissingWalletDataTypeError(this.property);
        console.error(missingWalletType);
        return err(missingWalletType);
    }
  }

  static parseConditions(schema: any): Array<Condition> {
    const conditions = new Array<Condition>();

    for (const conditionName in schema) {
      const opName = SDQL_OperatorName(conditionName);
      const rightOperand = schema[conditionName];
      switch (conditionName) {
        case "ge":
          conditions.push(new ConditionGE(opName, null, Number(rightOperand)));
          break;
        case "l":
          conditions.push(new ConditionL(opName, null, Number(rightOperand)));
          break;
        case "in":
          conditions.push(
            new ConditionIn(opName, null, rightOperand as Array<any>),
          );
          break;
        case "g":
          conditions.push(new ConditionG(opName, null, Number(rightOperand)));
          break;
      }
    }

    return conditions;
  }
}
