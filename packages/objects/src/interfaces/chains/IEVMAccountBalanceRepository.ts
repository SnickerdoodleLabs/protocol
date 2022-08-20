import { ResultAsync } from "neverthrow";

import { AccountBalanceError, AjaxError } from "@objects/errors";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives";
import { BigNumber } from "@ethersproject/bignumber";

export interface IEVMBalance {
  ticker : TickerSymbol;
  chainId : ChainId;
  accountAddress : EVMAccountAddress;
  balance : BigNumberString; // TODO replace with a BigNumber type
  contractAddress : EVMContractAddress;
}

export interface ITokenBalance {
  networkId: ChainId,
  address: EVMContractAddress, // This is the token contract address
  balance: BigNumber; // TODO replace with a BigNumber type
}

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError>;
}
