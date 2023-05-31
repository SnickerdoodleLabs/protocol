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
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class DummySolanaIndexer implements ISolanaIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Solana,
      new IndexerSupportSummary(EChain.Solana, false, false, false),
    ],
    [
      EChain.SolanaTestnet,
      new IndexerSupportSummary(EChain.SolanaTestnet, false, false, false),
    ],
  ]);

  public constructor() {}

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

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    throw new Error("Method not implemented.");
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [EChain.Solana, EChain.SolanaTestnet];
    return supportedChains;
  }
}
