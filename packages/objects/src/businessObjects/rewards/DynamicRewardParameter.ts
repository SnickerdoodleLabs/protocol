import { ESolidityAbiParameterType } from "@objects/enum/index.js";

export interface ITypeAndValue {
  type: ESolidityAbiParameterType;
  value: string;
}

export interface IDynamicRewardParameter {
  // required fields
  compensationKey: ITypeAndValue;
  recipientAddress: ITypeAndValue;
  // allow for optional fields
  [index: string]: ITypeAndValue | undefined;
}
