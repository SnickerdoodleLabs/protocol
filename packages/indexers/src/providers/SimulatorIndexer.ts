import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  BlockNumber,
  EChainTechnology,
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  EVMTransactionHash,
  TickerSymbol,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
  EChain,
  IndexerSupportSummary,
  EDataProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/index.js";

@injectable()
export class SimulatorEVMTransactionRepository implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.DevDoodle,
      new IndexerSupportSummary(EChain.DevDoodle, true, false, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return okAsync(undefined);
  }

  public name(): string {
    return EDataProvider.Sim;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    const num = Math.floor(Math.random() * 10);
    const result: TokenBalance[] = [];
    for (let i = 0; i < num; i++) {
      const item = new TokenBalance(
        EChainTechnology.EVM,
        TickerSymbol((Math.random() + 1).toString(36).substring(5)),
        chain,
        EVMContractAddress(
          Math.floor(Math.random() * 4) +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
              Math.floor(Math.random() * 4),
            ),
        ),
        accountAddress,
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        18,
      );
      result.push(item);
    }
    return okAsync(result);
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    const num = Math.floor(Math.random() * 10) + 1;
    const result: EVMNFT[] = [];
    for (let i = 0; i < num; i++) {
      const item = new EVMNFT(
        EVMContractAddress("EVMContractAddress#"),
        BigNumberString(`${Math.floor(Math.random() * 1000)}`),
        "erc721",
        accountAddress,
        TokenUri("tokenURI"),
        { raw: "metadata" },
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        "Fake Token #" + i,
        chain,
        BlockNumber(i),
        //86400 => day
        UnixTimestamp(Date.now() - i * (Date.now() % 86400)),
      );
      result.push(item);
    }
    return okAsync(result);
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    const num = Math.floor(Math.random() * 10);
    const result: EVMTransaction[] = [];
    for (let i = 0; i < num; i++) {
      const timestamp =
        endTime == undefined
          ? new Date()
          : new Date(
              startTime.getTime() +
                Math.floor(
                  Math.random() * (endTime.getTime() - startTime.getTime()),
                ),
            );
      const item = new EVMTransaction(
        chain,
        EVMTransactionHash("hash"),
        UnixTimestamp(timestamp.getTime() / 1000),
        null,
        accountAddress,
        null,
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        null,
        null,
        null,
        null,
        null,
        null,
      );
    }
    return okAsync(result);
  }

  public getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, never> {
    return this.configProvider.getConfig().map((config) => {
      // The Simulator Indexer is available if you've provided a dev chain URL
      // This is actually important now, because the supported chains is based on the health
      // status of the indexers. The doodlechain is available if we have a provider URL for it;
      // make sure prod does not have one.
      if (config.devChainProviderURL == null) {
        this.health.set(EChain.DevDoodle, EComponentStatus.NoKeyProvided);
      } else {
        this.health.set(EChain.DevDoodle, EComponentStatus.Available);
      }

      return this.health;
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
}
