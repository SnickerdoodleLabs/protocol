import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  TokenBalance,
  SolanaNFT,
  SolanaTransaction,
  EChain,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  EChainTechnology,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TickerSymbol,
  SolanaCollection,
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class SolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  private _connections?: ResultAsync<SolClients, never>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        if (chainId != ChainId(EChain.Solana)) {
          return errAsync(
            new AccountIndexingError("invalid chain id for solana", chainId),
          );
        }

        const backup = {
          method: "getBalance",
          jsonrpc: "2.0",
          id: "1",
          params: ["Hqx7JKUrNMzZPfgapu3FK4xGFPzxdwJdYEJCeXkVBCbg"],
        };

        return this.ajaxUtils.post<IAlchemyBalanceResponse>(
          new URL(config.alchemyEndpoints.solana),
          JSON.stringify(backup),
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .andThen((SolanaNativeBalance) => {
        const nativeBalance = new TokenBalance(
          EChainTechnology.Solana,
          TickerSymbol("SOL"),
          chainId,
          null,
          accountAddress,
          BigNumberString(SolanaNativeBalance.result.value.toString()),
          getChainInfoByChainId(chainId).nativeCurrency.decimals,
        );
        return okAsync([nativeBalance]);
      });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError> {
    return this._getConnectionForChainId(chainId)
      .andThen(([conn, metaplex]) => {
        return ResultAsync.fromPromise(
          metaplex
            .nfts()
            .findAllByOwner({ owner: new PublicKey(accountAddress) }),
          (e) => new AccountIndexingError("error finding sol nfts", e),
        );
      })
      .orElse((e) => {
        this.logUtils.error("error fetching solana nfts", e);
        return okAsync([]);
      })
      .map((nfts) => {
        return nfts
          .map((nft) => {
            return new SolanaNFT(
              chainId,
              accountAddress,
              SolanaTokenAddress(nft.address.toBase58()),
              nft.collection
                ? new SolanaCollection(
                    SolanaTokenAddress(nft.collection?.address.toBase58()),
                    nft.collection?.verified,
                  )
                : null,
              nft.uri,
              nft.isMutable,
              nft.primarySaleHappened,
              nft.sellerFeeBasisPoints,
              SolanaAccountAddress(nft.updateAuthorityAddress.toBase58()),
              nft.tokenStandard,
              TickerSymbol(nft.symbol),
              nft.name,
            );
          })
          .filter((val, i, arr) => {
            return (
              i ==
              arr.findIndex((ind) => {
                return ind.mint == val.mint;
              })
            );
          }); // remove duplicates
      });
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]); //TODO
  }

  private _getConnectionForChainId(
    chainId: ChainId,
  ): ResultAsync<[Connection, Metaplex], AccountIndexingError> {
    return this._getConnections().andThen((connections) => {
      switch (chainId) {
        case ChainId(EChain.Solana):
          return okAsync(connections.mainnet);
        case ChainId(EChain.SolanaTestnet):
          return okAsync(connections.testnet);
        default:
          return errAsync(
            new AccountIndexingError("invalid chain id for solana"),
          );
      }
    });
  }

  private _getConnections(): ResultAsync<SolClients, never> {
    if (this._connections) {
      return this._connections;
    }

    this._connections = this.configProvider.getConfig().andThen((config) => {
      return ResultUtils.combine([
        this._getConnectionForEndpoint(config.alchemyEndpoints.solana),
        this._getConnectionForEndpoint(config.alchemyEndpoints.solanaTestnet),
      ]).map(([mainnet, testnet]) => {
        return {
          mainnet,
          testnet,
        };
      });
    });

    return this._connections;
  }

  private _getConnectionForEndpoint(
    endpoint: string,
  ): ResultAsync<[Connection, Metaplex], never> {
    const connection = new Connection(endpoint);
    const metaplex = new Metaplex(connection);
    return okAsync([connection, metaplex]);
  }

  private _lamportsToSol(lamports: number): BigNumberString {
    return BigNumberString((lamports / LAMPORTS_PER_SOL).toString());
  }
}

interface SolClients {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
}

type ISolscanBalanceResponse = {
  tokenAddress: SolanaTokenAddress;
  tokenAmount: {
    amount: BigNumberString;
    decimals: number;
    uiAmount: number;
    uiAmountString: BigNumberString;
  };
  tokenAccount: string;
  tokenName: string;
  tokenIcon: URLString;
  rentEpoch: number;
  lamports: number;
}[];

type IAlchemyBalanceRequest = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};

type IAlchemyBalanceResponse = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};
