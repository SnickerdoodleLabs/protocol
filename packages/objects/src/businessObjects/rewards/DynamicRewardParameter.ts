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
