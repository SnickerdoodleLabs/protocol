import { ResultAsync } from "neverthrow";

import { AjaxError, BigNumberString, ChainId, EVMAccountAddress } from "../..";

import { AccountBalanceError } from "@objects/errors/AccountBalanceError";

export interface IEVMTokenInfo {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  balance: BigNumberString;

  contract_name?: string;
  logo_url?: string;
  last_transferred_at?: string;
  type?: string;
}

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMTokenInfo[], AccountBalanceError | AjaxError>;
}
