import {
  ChainId,
  LinkedAccount,
  TokenBalance,
  PersistenceError,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPortfolioBalanceRepository {
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
