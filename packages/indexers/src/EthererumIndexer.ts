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
  EVMAccountAddress,
  EVMTransaction,
  EVMNFT,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  IEVMTransactionRepository,
  TokenBalance,
  EChain,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
  EVMContractAddress,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TokenUri,
  EVMBlockNumber,
} from "@snickerdoodlelabs/objects";
import {
  Network,
  Alchemy,
  AssetTransfersWithMetadataParams,
} from "alchemy-sdk";
import { ethers } from "ethers";
import { response } from "express";
import { inject } from "inversify";
import { err, errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class EthereumIndexer
  implements
    IEVMTransactionRepository,
    IEVMAccountBalanceRepository,
    IEVMNftRepository
{
  private _mainnetAlchemy?: ResultAsync<Alchemy, AccountIndexingError>;
  private _testnetAlchemy?: ResultAsync<Alchemy, AccountIndexingError>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  private _getAlchemy(
    chainID: ChainId,
  ): ResultAsync<Alchemy, AccountIndexingError> {
    if (this._mainnetAlchemy && this._testnetAlchemy) {
      switch (chainID) {
        case ChainId(EChain.EthereumMainnet):
          return this._mainnetAlchemy;
        case ChainId(EChain.Goerli):
          return this._testnetAlchemy;
        default:
          return errAsync(
            new AccountIndexingError(
              "Unsupported chain for Ethereum indexer",
              chainID,
            ),
          );
      }
    }

    return this.configProvider.getConfig().andThen((config) => {
      this._mainnetAlchemy = okAsync(
        new Alchemy({
          apiKey: config.alchemyKeys[EChain.EthereumMainnet],
          network: Network.ETH_MAINNET,
        }),
      );
      this._testnetAlchemy = okAsync(
        new Alchemy({
          apiKey: config.alchemyKeys[EChain.Goerli],
          network: Network.ETH_GOERLI,
        }),
      );

      return this._getAlchemy(chainID);
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    // const data = await alchemy.core.getAssetTransfers({
    //   fromBlock: "0x0",
    //   fromAddress: "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",
    //   category: ["external", "internal", "erc20", "erc721", "erc1155"],
    // });
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._getEtherscanBaseURL(chainId),
      this._getBlockNumber(chainId, startTime),
      this._getBlockNumber(chainId, endTime),
    ]).andThen(([config, baseURL, fromBlock, toBlock]) => {
      const url = urlJoinP(baseURL, ["api"], {
        module: "account",
        action: "txlist",
        address: accountAddress,
        startblock: fromBlock,
        endblock: endTime ? toBlock : undefined,
        page: 1,
        offset: 100,
        sort: "asc",
        apikey: config.etherscanApiKey,
      });

      return okAsync([]);
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this._getAlchemy(chainId).andThen((alchemy) => {
      return ResultAsync.fromPromise(
        alchemy.core.getTokenBalances(accountAddress),
        (e) => new AccountIndexingError("error fetching token balances", e),
      ).andThen((response) => {
        return ResultUtils.combine(
          response.tokenBalances.map((balance) => {
            if (balance.tokenBalance == null) {
              return okAsync(undefined);
            }

            return this.tokenPriceRepo
              .getTokenInfo(chainId, balance.contractAddress)
              .andThen((info) => {
                if (info == null) {
                  return okAsync(undefined);
                }

                return okAsync(
                  new TokenBalance(
                    EChainTechnology.EVM,
                    info.symbol,
                    chainId,
                    info.address,
                    accountAddress,
                    BigNumberString(balance.tokenBalance),
                    BigNumberString("0"),
                  ),
                );
              })
              .orElse((e) => {
                this.logUtils.error("error fetching token info", e);
                return okAsync(undefined);
              });
          }),
        ).map((unfiltered) => {
          return unfiltered.filter(
            (item) => item != undefined,
          ) as TokenBalance[];
        });
      });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    pageKey?: string,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return this._getAlchemy(chainId).andThen((alchemy) => {
      return ResultAsync.fromPromise(
        alchemy.nft.getNftsForOwner(accountAddress, { pageKey: pageKey }),
        (e) => new AccountIndexingError("error fetching nfts", e),
      ).andThen((response) => {
        return okAsync(
          response.ownedNfts.map((nft) => {
            return new EVMNFT(
              EVMContractAddress(nft.contract.address),
              BigNumberString(nft.tokenId),
              nft.tokenType,
              accountAddress,
              nft.tokenUri ? TokenUri(nft.tokenUri.raw) : undefined,
              nft.rawMetadata,
              BigNumberString(nft.balance.toString()),
              nft.title,
              chainId,
            );
          }),
        ).andThen((nfts) => {
          if (response.pageKey) {
            return this.getTokensForAccount(
              chainId,
              accountAddress,
              response.pageKey,
            ).map((otherNfts) => {
              return [...nfts, ...otherNfts];
            });
          }
          return okAsync(nfts);
        });
      });
    });
  }

  private _getBlockNumber(
    chain: ChainId,
    timestamp: Date | undefined,
  ): ResultAsync<number, AccountIndexingError> {
    if (timestamp == undefined) {
      return okAsync(-1);
    }

    return ResultUtils.combine([
      this._getEtherscanBaseURL(chain),
      this.configProvider.getConfig(),
    ]).andThen(([baseUrl, config]) => {
      const url = new URL(
        urlJoinP(baseUrl, ["api"], {
          module: "block",
          action: "getblocknobytime",
          timestamp: (timestamp.getTime() / 1000).toFixed(0),
          closest: "before",
          apikey: config.etherscanApiKey,
        }),
      );

      return this.ajaxUtils
        .get<{
          status: string;
          message: string;
          result: BigNumberString;
        }>(url)
        .map((resp) => {
          return Number.parseInt(resp.result);
        })
        .mapErr(
          (e) => new AccountIndexingError("error loading block number", e),
        );
    });
  }

  private _getEtherscanBaseURL(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    switch (chain) {
      case ChainId(EChain.EthereumMainnet):
        return okAsync("https://api.etherscan.io");
      case ChainId(EChain.Goerli):
        return okAsync("https://api-goerli.etherscan.io/");
      case ChainId(EChain.Kovan):
        return okAsync("https://api-kovan.etherscan.io/");
      default:
        return errAsync(
          new AccountIndexingError("invalid chainId for etherscan"),
        );
    }
  }
}
