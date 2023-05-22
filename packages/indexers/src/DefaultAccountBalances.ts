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
  BigNumberString,
  chainConfig,
  ChainId,
  EChain,
  EChainType,
  EIndexer,
  EVMAccountAddress,
  IAccountBalances,
  IEVMAccountBalanceRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  PersistenceError,
  SolanaAccountAddress,
  TokenBalance,
  URLString,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { AlchemyIndexer } from "@indexers/providers/AlchemyIndexer.js";
import { EtherscanIndexer } from "@indexers/providers/EtherscanIndexer.js";
import { MoralisEVMPortfolioRepository } from "@indexers/providers/MoralisEVMPortfolioRepository.js";
import { OklinkIndexer } from "@indexers/providers/OklinkIndexer.js";
import { PolygonIndexer } from "@indexers/providers/PolygonIndexer.js";
import { SolanaIndexer } from "@indexers/providers/SolanaIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { EtherscanNativeBalanceRepository } from "packages/indexers/src/providers/EtherscanNativeBalanceRepository.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: SolanaIndexer;
  protected ethereum: EtherscanIndexer;
  protected matic: IEVMAccountBalanceRepository;
  protected etherscan: EtherscanNativeBalanceRepository;
  protected alchemy: AlchemyIndexer;
  protected oklink: OklinkIndexer;

  protected preferredIndexers: Map<EChain, URLString[]>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.evm = new MoralisEVMPortfolioRepository(configProvider, ajaxUtils);
    this.ethereum = new EtherscanIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.sim = new SimulatorEVMTransactionRepository();
    this.sol = new SolanaIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.matic = new PolygonIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.etherscan = new EtherscanNativeBalanceRepository(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.alchemy = new AlchemyIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.oklink = new OklinkIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );

    this.preferredIndexers = new Map<EChain, URLString[]>([
      [
        EChain.Avalanche,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Binance,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.EthereumMainnet,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Fuji,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Gnosis,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Moonbeam,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Mumbai,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Polygon,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
      [
        EChain.Solana,
        [
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
          URLString(
            "https://solana-mainnet.g.alchemy.com/v2/pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          ),
        ],
      ],
    ]);

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    console.log("Initialize Default Account Balances: ");
    return ResultUtils.combine([
      this.ethereum.healthCheck(),
      this.alchemy.healthCheck(),
      this.sol.healthCheck(),
      this.etherscan.healthCheck(),
    ]).andThen(
      ([
        etherscanStatus,
        alchemyStatus,
        solRepoStatus,
        nativeBalanceStatus,
      ]) => {
        console.log("Etherscan Status: ", etherscanStatus);
        console.log("Alchemy Status: ", alchemyStatus);
        console.log("Sol Repo Status: ", solRepoStatus);
        console.log("Native Balance Status: ", nativeBalanceStatus);

        return okAsync(undefined);
      },
    );
  }

  public getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const evmRepo = this.evm;
        const solRepo = this.sol;
        const simulatorRepo = this.sim;
        const etherscanRepo = this.ethereum;
        const maticRepo = this.matic;
        const etherscanBalanceRepo = this.etherscan;
        const alchemyRepo = this.alchemy;
        const oklinkRepo = this.oklink;

        const chainInfo = chainConfig.get(chainId);
        if (chainInfo == null) {
          return errAsync(
            new AccountIndexingError(
              `No available chain info for chain ${chainId}`,
            ),
          );
        }

        switch (chainInfo.indexer) {
          case EIndexer.EVM:
            return etherscanBalanceRepo.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Polygon:
            if (chainInfo.type == EChainType.Testnet) {
              return alchemyRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            }
            return alchemyRepo.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Simulator:
            return simulatorRepo.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Solana:
            return solRepo.getBalancesForAccount(
              chainId,
              accountAddress as SolanaAccountAddress,
            );
          case EIndexer.Ethereum:
            return etherscanRepo.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Gnosis:
          case EIndexer.Binance:
          case EIndexer.Moonbeam:
            return etherscanBalanceRepo.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          default:
            return errAsync(
              new AccountIndexingError(
                `No available balance repository for chain ${chainId}`,
              ),
            );
        }
      })
      .orElse((e) => {
        this.logUtils.error(
          "error fetching balances",
          chainId,
          accountAddress,
          e,
        );
        return okAsync([]);
      })
      .map((tokenBalances) => {
        // Apprently the tokenBalance.balance can return as in invalid
        // BigNumber (blank or null), so we'll just correct any possible issue
        // here.
        return tokenBalances.map((tokenBalance) => {
          try {
            BigNumber.from(tokenBalance.balance);
          } catch (e) {
            // Can't convert to bignumber, set it to 0
            tokenBalance.balance = BigNumberString("0");
          }
          return tokenBalance;
        });
      });
  }
}
