import { ISDQLConditionString } from "@objects/primitives/ISDQLConditionString.js";
import { ISDQLExpressionString } from "@objects/primitives/ISDQLExpressionString.js";

export type ISDQLAnyEvaluatableString =
  | ISDQLConditionString
  | ISDQLExpressionString;
