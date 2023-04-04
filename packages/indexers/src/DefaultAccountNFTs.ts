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

import { AlchemyIndexer } from "@indexers/AlchemyIndexer.js";
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
  protected nftscan: IEVMNftRepository;
  protected simulatorRepo: IEVMNftRepository;
  protected solRepo: ISolanaNFTRepository;
  protected poapRepo: PoapRepository;
  protected alchemy: IEVMNftRepository;

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
    this.alchemy = new AlchemyIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
  }

  public getAlchemyRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.alchemy);
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
