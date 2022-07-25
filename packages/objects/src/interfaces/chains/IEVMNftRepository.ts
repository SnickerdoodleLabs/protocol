import { ResultAsync } from "neverthrow";

import {
  AjaxError,
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
} from "../..";

import { TickerSymbol } from "./IEVMAccountBalanceRepository";

import { AccountNFTError } from "@objects/errors/AccountNFTError";

export interface IEVMNFT {
  contract: EVMContractAddress;
  tokenId: BigNumberString;
  contractType: string;
  owner: EVMAccountAddress;
  tokenUri: string;
  metadata: string;
  amount: string;
  name: string;
  ticker: TickerSymbol;
  chain: ChainId;
}

export interface IEVMNftRepository {
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], AccountNFTError | AjaxError>;
}
