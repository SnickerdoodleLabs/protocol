import { InsufficientFundsError } from "@objects/errors/index.js";

export const blockchainErrorMapping: Map<string, Error> = new Map<
  string,
  Error
>([
  ["insufficient funds for intrinsic transaction cost", InsufficientFundsError], //cannot map to a class 
  ["sender doesn't have enough funds to send tx", InsufficientFundsError],
]);
