import {
  AjaxError,
  BlockchainProviderError,
  BlockNumber,
  ChainId,
  ConsentContractError,
  ConsentContractRepositoryError,
  EthereumAccountAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBlockchainListener } from "@core/interfaces/api";
import { IQueryService, IQueryServiceType } from "@core/interfaces/business";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
} from "@core/interfaces/data";

@injectable()
export class BlockchainListener implements IBlockchainListener {
  protected averageBlockMiningTime = 4000;
  protected latestKnownBlockNumber: BlockNumber = BlockNumber(-1);
  protected mainProviderInitialized = false;

  constructor(
    @inject(IQueryServiceType) protected queryService: IQueryService,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<
    void,
    BlockchainProviderError | PersistenceError | UninitializedError
  > {
    /**
     * The BlockchainListener needs to actually listen to ALL the chains we are monitoring;
     * this means we need to get ALL the providers and hook up listeners for all the accounts
     * in the wallet
     */

    setInterval(() => {
      this.controlChainBlockMined();
    }, this.averageBlockMiningTime);

    return ResultUtils.combine([
      this.blockchainProvider.getAllProviders(),
      this.contextProvider.getContext(),
      this.dataWalletPersistence.getAccounts(),
    ])
      .andThen(([providerMap, _context, accounts]) => {
        // Now we have the providers, loop over them
        return ResultUtils.combine([
          ...Array.from(providerMap.entries()).map(([chainId, provider]) => {
            return this.monitorChain(chainId, provider, accounts);
          }),
        ]);
      })
      .map(() => {});
  }

  protected controlChainBlockMined(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError
  > {
    return this.blockchainProvider.getLatestBlock().andThen((currentBlock) => {
      const currentBlockNumber = BlockNumber(currentBlock.number);

      if (this.latestKnownBlockNumber < currentBlockNumber) {
        this.latestKnownBlockNumber = currentBlockNumber;

        this.listenForConsentContractsEvents(currentBlockNumber);
      }

      return okAsync(undefined);
    });
  }

  protected listenForConsentContractsEvents(
    blockNumber: BlockNumber,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | ConsentContractRepositoryError
    | UninitializedError
    | AjaxError
    | ConsentContractError
  > {
    return this.consentContractRepository
      .getConsentContracts()
      .andThen((consentContractsMap) => {
        return ResultUtils.combine(
          Array.from(consentContractsMap.values()).map((consentContract) => {
            // Only consent owners can request data
            return consentContract
              .getConsentOwner()
              .andThen((consentOwner) => {
                return consentContract.getRequestForDataListByRequesterAddress(
                  consentOwner,
                  blockNumber,
                  blockNumber,
                );
              })
              .andThen((requestForDataObjects) => {
                return ResultUtils.combine(
                  requestForDataObjects.map((requestForDataObject) => {
                    return this.queryService.onQueryPosted(
                      requestForDataObject.consentContractAddress,
                      requestForDataObject.requestedCID,
                    );
                  }),
                ).map(() => {});
              });
          }),
        ).map(() => {});
      });
  }

  protected monitorChain(
    chainId: ChainId,
    provider: ethers.providers.JsonRpcProvider,
    accounts: EthereumAccountAddress[],
  ): ResultAsync<void, BlockchainProviderError> {
    // For each provider, hook up listeners or whatever, that will monitor for activity
    // on the chain for each address.
    return ResultUtils.combine(
      accounts.map((account) => {
        // Hook up the listeners for this account
        // TODO
        return okAsync(undefined);
      }),
    ).map(() => {});
  }
  /*

  private initializeMainProviderEvents(
    provider: ethers.providers.JsonRpcProvider,
    context: CoreContext,
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
    // Here is where we setup listening to events on the Consent Contract
    // Will look something like this:
    // Pretend we know the contract address that we are listening for
    provider.listenForEventOnContract(context.consentContractAddress, "OnDataRequested", (contractAddress: EthereumContractAddress, cid: IpfsCID) => {
      // This is the method that is called when an event happens on the consent
      this.queryService.onQueryPosted(contractAddress, cid)
        // This mapErr is because any returned error would disappear into the ether without it.
        .mapErr((e) => {
          this.logUtils.error(e);
        })
    })

    this.mainProviderInitialized = true;
  }
  */
}
