import { inject, injectable } from "inversify";
import { combine, ResultAsync } from "neverthrow";
import { ethers } from "ethers";
import { IBlockchainListener } from "@query-engine/interfaces/api";
import { IBlockchainProvider, IBlockchainProviderType, IConfigProvider, IConfigProviderType, IContextProvider, IContextProviderType, ILogUtils, ILogUtilsType } from "@query-engine/interfaces/utilities";
import { QueryEngineContext } from "@browser-extension/interfaces/objects";
import { BlockchainUnavailableError, ChainId, EthereumAccountAddress } from "@snickerdoodlelabs/objects";

@injectable()
export class BlockchainListener implements IBlockchainListener {
  protected mainProviderInitialized: boolean = false;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, BlockchainUnavailableError> {
    return combine([
      this.blockchainProvider.getProvider(),
      this.contextProvider.getContext(),
    ]).map(([provider, context]) => {
      if (this.mainProviderInitialized === false) {
        this.initializeMainProviderEvents(provider, context);
      }
    });
  }

  private initializeMainProviderEvents(
    provider: ethers.providers.JsonRpcProvider,
    context: QueryEngineContext,
  ) {
    // These are events that actually occur on the ETH provider object
    // itself, it is not an on-chain event.
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: EthereumAccountAddress[]) => {
      this.logUtils.debug(
        `Accounts changed to ${accounts}. Need to refresh iframe and the UI`,
      );
      //context.onAccountChanged.next(accounts[0]);
    });

    // Subscribe to chainId change
    provider.on("network", (network: { chainId: ChainId }) => {
      this.logUtils.debug(`Main provider chain changed to ${network.chainId}.`);
      //context.onChainChanged.next(network.chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: ChainId }) => {
      this.logUtils.debug(
        `Main provider successfully connected to chain ${info.chainId}`,
      );
      //context.onChainConnected.next(info.chainId);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      this.logUtils.debug(
        `Main provider has disconnected from the chain with code ${error.code} and message ${error.message}`,
      );
    });

    provider.on("error", (e) => {
      this.logUtils.error("Main provider has experienced an error");
      this.logUtils.error(e);
    });

    // *****************************************************************
    // Here is where we setup listening to 

    this.mainProviderInitialized = true;
  }
}
