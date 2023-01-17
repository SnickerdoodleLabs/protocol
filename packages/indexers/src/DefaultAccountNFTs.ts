import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountNFTs,
  IEVMNftRepository,
  ISolanaNFTRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoonbeamIndexer } from "@indexers/MoonbeamIndexer.js";
import { MoralisEVMPortfolioRepository } from "@indexers/MoralisEVMPortfolioRepository.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountNFTs implements IAccountNFTs {
  protected ethereum: IEVMNftRepository;
  protected evm: IEVMNftRepository;
  protected simulatorRepo: IEVMNftRepository;
  protected solRepo: ISolanaNFTRepository;
  protected glmrRepo: IEVMNftRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    // this.ethereum = new EthereumIndexer(
    //   configProvider,
    //   ajaxUtils,
    //   tokenPriceRepo,
    //   logUtils,
    // );
    this.evm = new MoralisEVMPortfolioRepository(configProvider, ajaxUtils);
    this.ethereum = this.evm;
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new SolanaIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.glmrRepo = new MoonbeamIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
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

  public getMoonbeamNFTRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.glmrRepo);
  }
}
