import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  BlockNumber,
  ChainId,
  EChainTechnology,
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  EVMTransactionHash,
  IEVMIndexer,
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

@injectable()
export class SimulatorEVMTransactionRepository implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, false, false),
    ],
    [
      EChain.Moonbeam,
      new IndexerSupportSummary(EChain.Moonbeam, true, false, false),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, true, false, false),
    ],
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, true, false, false),
    ],
  ]);

  public name(): string {
    return EDataProvider.Sim;
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    const num = Math.floor(Math.random() * 10);
    const result: TokenBalance[] = [];
    for (let i = 0; i < num; i++) {
      const item = new TokenBalance(
        EChainTechnology.EVM,
        TickerSymbol((Math.random() + 1).toString(36).substring(5)),
        chainId,
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
    chainId: ChainId,
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
        chainId,
        BlockNumber(i),
        //86400 => day
        UnixTimestamp(Date.now() - i * (Date.now() % 86400)),
      );
      result.push(item);
    }
    return okAsync(result);
  }

  public getEVMTransactions(
    chainId: ChainId,
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
        chainId,
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

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    this.health.set(EChain.EthereumMainnet, EComponentStatus.Available);
    return okAsync(this.health);
    // return this.configProvider.getConfig().andThen((config) => {
    //   console.log(
    //     "Alchemy Keys: " + JSON.stringify(config.apiKeys.alchemyApiKeys),
    //   );

    //   const keys = this.indexerSupport.keys();
    //   this.indexerSupport.forEach(
    //     (value: IndexerSupportSummary, key: EChain) => {
    //       if (config.apiKeys.alchemyApiKeys[key] == undefined) {
    //         this.health.set(key, EComponentStatus.NoKeyProvided);
    //       }
    //       this.health.set(key, EComponentStatus.Available);
    //     },
    //   );
    //   return okAsync(this.health);
    // });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
}
