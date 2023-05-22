import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  chainConfig,
  ChainId,
  ChainTransaction,
  EIndexer,
  EVMAccountAddress,
  IAccountIndexing,
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  SolanaAccountAddress,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { EtherscanIndexer } from "@indexers/providers/EtherscanIndexer.js";
import { PolygonIndexer } from "@indexers/providers/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/providers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/providers/SolanaIndexer.js";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected etherscan: EtherscanIndexer;
  protected simulatorRepo: IEVMTransactionRepository;
  protected solana: SolanaIndexer;
  protected matic: PolygonIndexer;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    // @inject(IConfigProviderType) protected configProvider: IConfigProvider,

    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.etherscan = new EtherscanIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solana = new SolanaIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.matic = new PolygonIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    console.log("Initialize Default Account Indexers: ");
    return ResultUtils.combine([
      this.etherscan.healthCheck(),
      this.solana.healthCheck(),
      this.matic.healthCheck(),
    ]).andThen(([etherscanStatus, solanaStatus, polygonStatus]) => {
      console.log("Etherscan Status: ", etherscanStatus);
      console.log("Solana Status: ", solanaStatus);
      console.log("Polygon Status: ", polygonStatus);
      return okAsync(undefined);
    });
  }

  public getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const evmRepo = this.etherscan;
      const etherscanRepo = this.etherscan;
      const solRepo = this.solana;
      const simulatorRepo = this.simulatorRepo;
      const maticRepo = this.matic;

      // Get the chain info for the transaction
      const chainInfo = chainConfig.get(chainId);
      if (chainInfo == null) {
        this.logUtils.error(`No available chain info for chain ${chainId}`);
        return okAsync([]);
      }

      switch (chainInfo.indexer) {
        case EIndexer.EVM:
          return evmRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Simulator:
          return simulatorRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Solana:
          return solRepo.getSolanaTransactions(
            chainId,
            accountAddress as SolanaAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Ethereum:
          return etherscanRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Polygon:
          return maticRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Gnosis:
          return etherscanRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Binance:
          return etherscanRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Moonbeam:
          return etherscanRepo.getEVMTransactions(
            chainId,
            accountAddress as EVMAccountAddress,
            new Date(timestamp * 1000),
          );
        default:
          this.logUtils.error(
            `No available indexer repository for chain ${chainId}`,
          );
          return okAsync([]);
      }
    });
  }
}
