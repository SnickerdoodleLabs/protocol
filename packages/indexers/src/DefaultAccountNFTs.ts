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
  ChainId,
  ComponentStatus,
  EChainType,
  EIndexer,
  EVMAccountAddress,
  IAccountNFTs,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  ISolanaNFTRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  PersistenceError,
  SolanaAccountAddress,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMPortfolioRepository } from "@indexers/MoralisEVMPortfolioRepository.js";
import { NftScanEVMPortfolioRepository } from "@indexers/NftScanEVMPortfolioRepository.js";
import { PoapRepository } from "@indexers/PoapRepository.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountNFTs implements IAccountNFTs {
  protected ethereum: IEVMNftRepository;
  protected evm: IEVMNftRepository;
  protected nftscan: NftScanEVMPortfolioRepository;
  protected simulatorRepo: IEVMNftRepository;
  protected solRepo: ISolanaNFTRepository;
  protected poapRepo: PoapRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.evm = new MoralisEVMPortfolioRepository(configProvider, ajaxUtils);
    this.ethereum = this.evm;
    this.nftscan = new NftScanEVMPortfolioRepository(configProvider, ajaxUtils);
    this.poapRepo = new PoapRepository(configProvider, ajaxUtils);
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new SolanaIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    console.log("Initialize Default Account Nfts: ");

    return ResultUtils.combine([
      this.poapRepo.healthCheck(),
      this.nftscan.healthCheck(),
    ]).andThen(([poapStatus, nftScanStatus]) => {
      console.log("Poap Status: ", poapStatus);
      console.log("NftScan Status: ", nftScanStatus);

      // const component = new ComponentStatus();

      return okAsync(undefined);
    });
  }

  public getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const solRepo = this.solRepo;
        const simulatorRepo = this.simulatorRepo;
        const nftScanRepo = this.nftscan;
        const poapRepo = this.poapRepo;

        const chainInfo = config.chainInformation.get(chainId);
        if (chainInfo == null) {
          return errAsync(
            new AccountIndexingError(
              `No available chain info for chain ${chainId}`,
            ),
          );
        }

        if (chainInfo.type == EChainType.Testnet) {
          return okAsync([]);
        }

        switch (chainInfo.indexer) {
          case EIndexer.EVM:
            return nftScanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Polygon:
            return nftScanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Simulator:
            return simulatorRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Solana:
            return solRepo.getTokensForAccount(
              chainId,
              accountAddress as SolanaAccountAddress,
            );
          case EIndexer.Ethereum:
            return nftScanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Gnosis:
            return poapRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Binance:
            return nftScanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Moonbeam:
            return nftScanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          default:
            return errAsync(
              new AccountIndexingError(
                `No available token repository for chain ${chainId}`,
              ),
            );
        }
      })
      .orElse((e) => {
        this.logUtils.error("error fetching nfts", chainId, accountAddress, e);
        return okAsync([]);
      });
  }

  public getPoapRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.poapRepo);
  }

  public getNftScanRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.nftscan);
  }

  public getEtherscanNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.ethereum);
  }

  public getEthereumNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.ethereum);
  }

  public getEVMNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.evm);
  }

  public getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.simulatorRepo);
  }

  public getSolanaNFTRepository(): ResultAsync<ISolanaNFTRepository, never> {
    return okAsync(this.solRepo);
  }
}
