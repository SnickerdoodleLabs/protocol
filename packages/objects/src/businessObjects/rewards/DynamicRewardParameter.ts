import { ESolidityAbiParameterType } from "@objects/enum/index.js";

export interface ITypeAndValue {
  type: ESolidityAbiParameterType;
  value: string;
}

export interface IDynamicRewardParameter {
  compensationKey: ITypeAndValue;
  recipientAddress: ITypeAndValue;
  [index: string]: ITypeAndValue;
}
