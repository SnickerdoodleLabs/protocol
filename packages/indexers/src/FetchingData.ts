import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountBalances,
  IAccountIndexing,
  IAccountNFTs,
  IEVMAccountBalanceRepository,
  ISolanaBalanceRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { AlchemyIndexer } from "@indexers/AlchemyIndexer.js";
import { EtherscanIndexer } from "@indexers/EtherscanIndexer.js";
import { EtherscanNativeBalanceRepository } from "@indexers/EtherscanNativeBalanceRepository.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMPortfolioRepository } from "@indexers/MoralisEVMPortfolioRepository.js";
import { OklinkIndexer } from "@indexers/OklinkIndexer.js";
import { PolygonIndexer } from "@indexers/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class FetchingData
  implements IAccountBalances, IAccountNFTs, IAccountIndexing
{
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: ISolanaBalanceRepository;
  protected ethereum: IEVMAccountBalanceRepository;
  protected matic: IEVMAccountBalanceRepository;
  protected etherscan: IEVMAccountBalanceRepository;
  protected alchemy: IEVMAccountBalanceRepository;
  protected oklink: IEVMAccountBalanceRepository;

  protected evm: IEVMTransactionRepository;
  protected simulatorRepo: IEVMTransactionRepository;
  protected solRepo: ISolanaTransactionRepository;
  protected matic: IEVMTransactionRepository;

  protected ethereum: IEVMNftRepository;
  protected evm: IEVMNftRepository;
  protected nftscan: IEVMNftRepository;
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

    this.evm = new EtherscanIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new SolanaIndexer(
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
  }

  public getLatestBalances(): ResultAsync<IEVMNftRepository, never> {
    
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

  public getPolygonTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.matic);
  }

  public getEthereumTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.evm);
  }

  public getEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.evm);
  }

  public getSimulatorEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.simulatorRepo);
  }

  public getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  > {
    return okAsync(this.solRepo);
  }

  public getEtherscanBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.etherscan);
  }

  public getPolygonBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.matic);
  }

  public getEthereumBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.ethereum);
  }

  public getEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.evm);
  }

  public getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.sim);
  }

  public getSolanaBalanceRepository(): ResultAsync<
    ISolanaBalanceRepository,
    never
  > {
    return okAsync(this.sol);
  }

  public getAlchemyBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.alchemy);
  }

  public getOklinkBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.oklink);
  }
}
