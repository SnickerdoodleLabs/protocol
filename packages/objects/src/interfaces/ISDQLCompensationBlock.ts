import { CompensationKey } from "@objects/primitives/CompensationKey.js";
import { ISDQLCompensationParameters } from "@objects/interfaces/ISDQLCompensationParameters.js";
import { ISDQLCompensations } from "@objects/interfaces/ISDQLCompensations.js";

export interface ISDQLCompensationBlock {
  [index: CompensationKey]: ISDQLCompensationParameters | ISDQLCompensations;
  parameters: ISDQLCompensationParameters;
}
