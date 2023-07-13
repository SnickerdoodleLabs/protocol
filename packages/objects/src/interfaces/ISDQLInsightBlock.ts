import { ISDQLConditionString } from "@objects/primitives/ISDQLConditionString.js";
import { ISDQLExpressionString } from "@objects/primitives/ISDQLExpressionString.js";

export interface ISDQLInsightBlock {
  name: string;
  target?: ISDQLConditionString;
  returns: ISDQLExpressionString;
}
