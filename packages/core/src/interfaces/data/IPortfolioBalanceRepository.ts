import {
  LinkedAccount,
  TokenBalance,
  PersistenceError,
  WalletNFT,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPortfolioBalanceRepository {
  getAccountBalances(
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<TokenBalance[], PersistenceError>;
  getAccountNFTs(
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError>;
}

export const IPortfolioBalanceRepositoryType = Symbol.for(
  "IPortfolioBalanceRepository",
);
