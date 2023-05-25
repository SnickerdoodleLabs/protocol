import {
  AjaxError,
  ChainId,
  SolanaAccountAddress,
  SolanaNFT,
  AccountIndexingError,
  SolanaTransaction,
  TokenBalance,
  EChain,
  ISolanaIndexer,
  EComponentStatus,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class DummySolanaIndexer
  implements
  ISolanaIndexer
{
  public constructor() {}
  getHealthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    throw new Error("Method not implemented.");
  }
  healthStatus(): EComponentStatus {
    throw new Error("Method not implemented.");
  }
  getSupportedChains(): EChain[] {
    throw new Error("Method not implemented.");
  }
  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], never> {
    return okAsync([]);
  }
  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], never> {
    return okAsync([]);
  }
  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AjaxError | AccountIndexingError> {
    return okAsync([]);
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [
      EChain.Solana,
      EChain.SolanaTestnet,
    ];
    return supportedChains;
  }
}
