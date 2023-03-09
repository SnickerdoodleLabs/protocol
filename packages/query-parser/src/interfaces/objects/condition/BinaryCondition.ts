import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";
import { ConditionOperandTypes } from "@query-parser/interfaces/utilities/index.js";
import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

export abstract class BinaryCondition extends Condition {
  constructor(
    name: SDQL_OperatorName,
    readonly lval: ConditionOperandTypes | null,
    readonly rval: ConditionOperandTypes,
  ) {
    super(name);
  }

  check(): boolean {
    // TODO
    return true;
  }
}
