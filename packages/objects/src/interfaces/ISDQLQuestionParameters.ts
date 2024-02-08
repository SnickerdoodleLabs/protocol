import { AccountAddress } from "@objects/primitives/AccountAddress.js";

export interface ISDQLQuestionParameters {
  [paramName: string]: unknown & {
    //a param can have other properties that we don't know of
    type: unknown;
    required: boolean;
    values?: unknown[];
  };

  recipientAddress: {
    type: AccountAddress;
    required: boolean;
  };
}