import { EDynamicRewardParameterType } from "@objects/enum/index.js";

export interface ITypeAndValue {
  type: EDynamicRewardParameterType;
  value: string;
}

export interface IDynamicRewardParameter {
  CompensationKey: ITypeAndValue;
  recipientAddress: ITypeAndValue;
  [index: string]: ITypeAndValue;
}
