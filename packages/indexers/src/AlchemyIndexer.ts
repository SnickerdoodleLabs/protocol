import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMAccountAddress,
  IEVMAccountBalanceRepository,
  EVMContractAddress,
  EChain,
  HexString,
  EVMNFT,
  IEVMNftRepository,
  BlockNumber,
  TokenUri,
  AccountAddress,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { CoinGeckoTokenInfo } from "packages/objects/src";
import { urlJoinP } from "url-join-ts";
import Web3 from "web3";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class AlchemyIndexer
  implements IEVMAccountBalanceRepository, IEVMNftRepository
{
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
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.getNonNativeBalance(chainId, accountAddress),
      this.getNativeBalance(chainId, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      return [nativeBalance, ...nonNativeBalance];
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return okAsync([]);
    // return this.configProvider.getConfig().andThen((config) => {
    //   const url = urlJoinP(
    //     config.alchemyEndpoints[chainInfo.name.toString()],
    //     ["getNFTs"],
    //     {
    //       owner: accountAddress,
    //     },
    //   );

    //   return this.ajaxUtils
    //     .get<IAlchemyNftResponse>(new URL(url))
    //     .map((response) => {
    //       const items: EVMNFT[] = response.ownedNfts.map((nft) => {
    //         return new EVMNFT(
    //           EVMContractAddress(nft.contract.address),
    //           BigNumberString(nft.id.tokenId),
    //           nft.contractMetadata.tokenType,
    //           EVMAccountAddress(accountAddress),
    //           TokenUri(nft.tokenUri.gateway),
    //           { raw: undefined },
    //           BigNumberString(nft.balance),
    //           nft.title,
    //           chainId,
    //           BlockNumber(Number(nft.contractMetadata.deployedBlockNumber)),
    //           undefined,
    //         );
    //       });
    //       return okAsync(items);
    //     });
    // });
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      const apiKey = config.etherscanApiKeys.get(chain);

      if (apiKey == null) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain: ", chain),
        );
      }

      return okAsync(apiKey);
    });
  }

  private nativeBalanceParams(
    chain: ChainId,
    accountAddress: AccountAddress,
  ): [string, TickerSymbol, ChainId] {
    switch (chain) {
      case EChain.EthereumMainnet:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress, "latest"],
            method: "eth_getBalance",
          }),
          TickerSymbol("ETH"),
          ChainId(1),
        ];
      case EChain.Polygon:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("MATIC"),
          ChainId(137),
        ];
      default:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("ETH"),
          ChainId(1),
        ];
    }
  }

  protected retrieveAlchemyUrl(
    chain: EChain,
    chainId: ChainId,
  ): ResultAsync<URLString, AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url = config.alchemyEndpoints.get(
        EChain[getChainInfoByChainId(chainId).name.toString()],
      );
      console.log("Alchemy url: ", url);
      if (url == undefined) {
        return errAsync(
          new AccountIndexingError("Alchemy Endpoint is missing"),
        );
      }
      return okAsync(url);
    });
  }

  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    // const chainInfo = getChainInfoByChainId(chainId);
    return this.retrieveAlchemyUrl(
      EChain[getChainInfoByChainId(chainId).name.toString()],
      chainId,
    ).andThen((url) => {
      const [requestParams, nativeTickerSymbol, nativeChain] =
        this.nativeBalanceParams(chainId, accountAddress);
      return this.ajaxUtils
        .post<IAlchemyNativeBalanceResponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          const weiValue = Web3.utils.hexToNumberString(response.result);
          const balance = new TokenBalance(
            EChainTechnology.EVM,
            nativeTickerSymbol,
            nativeChain,
            null,
            accountAddress,
            BigNumberString(weiValue),
            getChainInfoByChainId(chainId).nativeCurrency.decimals,
          );
          return okAsync(balance);
        });
    });
  }

  private getNonNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    // const chainInfo = getChainInfoByChainId(chainId);

    return this.retrieveAlchemyUrl(
      EChain[getChainInfoByChainId(chainId).name.toString()],
      chainId,
    ).andThen((url) => {
      // const url = config.alchemyEndpoints[chainInfo.name.toString()];
      return this.ajaxUtils
        .post<IAlchemyNonNativeReponse>(
          new URL(url),
          JSON.stringify({
            id: 0,
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [accountAddress, "erc20"],
          }),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          },
        )
        .andThen((response) => {
          return ResultUtils.combine(
            response.result.tokenBalances.map((entry) => {
              const weiValue = Web3.utils.hexToNumberString(entry.tokenBalance);

              const listValue = this.tokenPriceRepo.getTokenInfoFromList(
                entry.contractAddress,
              );

              if (listValue == undefined) {
                return okAsync(undefined);
              }
              const tokenInfo = listValue as CoinGeckoTokenInfo;
              return okAsync(
                new TokenBalance(
                  EChainTechnology.EVM,
                  TickerSymbol(tokenInfo.symbol),
                  chainId,
                  entry.contractAddress,
                  accountAddress,
                  BigNumberString(weiValue),
                  getChainInfoByChainId(chainId).nativeCurrency.decimals,
                ),
              );
            }),
          ).andThen((balances) => {
            return okAsync(
              balances.filter((x) => x != undefined) as TokenBalance[],
            );
          });
        });
    });
  }
}

interface IAlchemyNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString;
}

interface IAlchemyNonNativeReponse {
  jsonrpc: number;
  id: number;
  result: {
    address: EVMAccountAddress;
    tokenBalances: ITokenBalance[];
  };
}

interface ITokenBalance {
  contractAddress: EVMContractAddress;
  tokenBalance: HexString;
}

interface IAlchemyNftResponse {
  blockHash: number;
  ownedNfts: IAlchemyNft[];
  totalCount: number;
}

interface IAlchemyNft {
  balance: string;
  contract: {
    address: EVMContractAddress;
  };
  contractMetadata: {
    contractDeployer: string;
    deployedBlockNumber: number;
    name: string;
    symbol: string;
    tokenType: string;
    totalSupply: string;
  };
  description: string;
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  media: IAlchemyMediaObject[];
  metadata: {
    attributes: string;
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
  timeLastUpdated: string;
  title: string;
  tokenUri: {
    gateway: string;
    raw: string;
  };
}

interface IAlchemyRequestConfig {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
}

interface IAlchemyMediaObject {
  bytes: number;
  format: string;
  gateway: string;
  raw: string;
  thumbnail: string;
}
