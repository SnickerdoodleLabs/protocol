import { ESolidityAbiParameterType } from "@objects/enum/index.js";

export interface ITypeAndValue {
  type: ESolidityAbiParameterType;
  value: string;
}

export interface IDynamicRewardParameter {
  CompensationKey: ITypeAndValue;
  recipientAddress: ITypeAndValue;
  [index: string]: ITypeAndValue;
}
