import {
  ChainId,
  LinkedAccount,
  TokenBalanceWithOwnerAddress,
  PersistenceError,
  WalletNFT,
  TokenBalance,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPortfolioBalanceRepository {
  /**
  This Method is exclusively for spa, should not be a part of a query response !
  */
  getAccountBalancesWithOwnerAddress(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
    filterEmpty?: boolean,
  ): ResultAsync<TokenBalanceWithOwnerAddress[], PersistenceError>;
  getAccountBalances(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
    filterEmpty?: boolean,
  ): ResultAsync<TokenBalance[], PersistenceError>;
  getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError>;
}

export const IPortfolioBalanceRepositoryType = Symbol.for(
  "IPortfolioBalanceRepository",
);
