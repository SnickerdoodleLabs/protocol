import {
  ChainId,
  LinkedAccount,
  TokenBalance,
  PersistenceError,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPortfolioBalanceRepository {
  /**
  This Method is exclusively for spa, should not be a part of a query response !
  */
  getAccountBalances(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
    filterEmpty?: boolean,
  ): ResultAsync<TokenBalance[], PersistenceError>;
  getAccountBalancesWithoutOwnerAddress(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
    filterEmpty?: boolean,
  ): ResultAsync<Omit<TokenBalance, "accountAddress">[], PersistenceError>;
  getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError>;
}

export const IPortfolioBalanceRepositoryType = Symbol.for(
  "IPortfolioBalanceRepository",
);
