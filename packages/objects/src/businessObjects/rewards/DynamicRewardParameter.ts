import { RecipientAddressType } from "@objects/primitives";
export interface ITypeAndValue {
  type: string;
  value: string;
}

type recipientAddressType = "address";
export interface IRecipientAddress extends ITypeAndValue {
  type: recipientAddressType;
}

export interface IDynamicRewardParameter {
  recipientAddress: IRecipientAddress;
  [index: string]: ITypeAndValue;
}

export class DynamicRewardParameter {
  recipientAddress: RecipientAddressType;

  constructor(recipientAddress: RecipientAddressType) {
    this.recipientAddress = recipientAddress;
  }
}
