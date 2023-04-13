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
  EIndexer,
  AccountAddress,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class AlchemyIndexer
  implements IEVMAccountBalanceRepository, IEVMNftRepository
{
  private _addressMapping = new Map<EVMContractAddress, TickerSymbol>([
    [
      EVMContractAddress("0x912ce59144191c1204e64559fe8253a0e49e6548"),
      TickerSymbol("ARB"),
    ],
    [
      EVMContractAddress("0x4200000000000000000000000000000000000042"),
      TickerSymbol("OP"),
    ],
    [
      EVMContractAddress("0x82af49447d8a07e3bd95bd0d56f35241523fbab1"),
      TickerSymbol("WETH"),
    ],
    [
      EVMContractAddress("0x4200000000000000000000000000000000000006"),
      TickerSymbol("WETH"),
    ],
    [
      EVMContractAddress("0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000"),
      TickerSymbol("Ether"),
    ],
  ]);

  private contractConnection;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    // this.contractConnection = ;
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.etherscanApiKeys.has(chain)) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain: ", chain),
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }

  private nativeBalanceParams(
    chain: ChainId,
    accountAddress: AccountAddress,
  ): [IAlchemyRequestConfig, TickerSymbol, ChainId] {
    switch (chain) {
      case EChain.EthereumMainnet:
        return [
          {
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress, "latest"],
            method: "eth_getBalance",
          },
          TickerSymbol("ETH"),
          ChainId(1),
        ];
      case EChain.Polygon:
        return [
          {
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          },
          TickerSymbol("MATIC"),
          ChainId(137),
        ];
      // case EChain.Arbitrum:
      //   return [
      //     {
      //       id: 1,
      //       jsonrpc: "2.0",
      //       params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83"],
      //       method: "eth_getBalance1",
      //     },
      //     TickerSymbol("ETH"),
      //     ChainId(1),
      //   ];
      default:
        return [
          {
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          },
          TickerSymbol("ETH"),
          ChainId(1),
        ];
    }
  }

  /* Fetching ETH Balance from Chains */
  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return this.configProvider.getConfig().andThen((config) => {
      const url = config.alchemyEndpoints[chainInfo.name.toString()];

      const params = this.nativeBalanceParams(chainId, accountAddress);
      const requestParams = params[0];
      const nativeTickerSymbol = params[1];
      const nativeChain = params[2];

      console.log("native balance url: ", url);
      return this.ajaxUtils
        .post<IAlchemyNativeBalanceResponse>(
          new URL(url),
          JSON.stringify(requestParams),
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        )
        .andThen((response) => {
          const weiValue = parseInt(response.result, 16).toString();
          const balance = new TokenBalance(
            EChainTechnology.EVM,
            nativeTickerSymbol,
            nativeChain, // this should not be the case, we should be adding by symbols
            null,
            accountAddress,
            BigNumberString(weiValue),
            chainInfo.nativeCurrency.decimals,
          );
          console.log("Alchemy Chain: ", chainId, " has balance: ", balance);
          return okAsync(balance);
        });
    });
  }

  private getNonNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return this.configProvider.getConfig().andThen((config) => {
      const url = config.alchemyEndpoints[chainInfo.name.toString()];
      console.log("non native balance url: ", url);
      return this.ajaxUtils
        .post<INonNativeReponse>(
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
          console.log(
            "response.result.tokenBalances: ",
            response.result.tokenBalances,
          );
          return ResultUtils.combine(
            response.result.tokenBalances.map((entry) => {
              const weiValue = parseInt(entry.tokenBalance, 16).toString();
              return this.tokenPriceRepo
                .getTokenInfo(chainId, entry.contractAddress)
                .andThen((tokenInfo) => {
                  if (tokenInfo == null) {
                    return okAsync(undefined);
                  }

                  return okAsync(
                    new TokenBalance(
                      EChainTechnology.EVM,
                      TickerSymbol(tokenInfo.symbol),
                      chainId,
                      entry.contractAddress,
                      accountAddress,
                      BigNumberString(weiValue),
                      chainInfo.nativeCurrency.decimals,
                    ),
                  );
                });
            }),
          ).andThen((balances) => {
            return okAsync(
              balances.filter((x) => x != undefined) as TokenBalance[],
            );
          });
        })
        .andThen((balances) => {
          console.log("response balances: ", balances);
          return okAsync(balances);
        });
    });
  }

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
    return this.configProvider.getConfig().andThen((config) => {
      const url = urlJoinP(
        config.alchemyEndpoints[chainInfo.name.toString()],
        ["getNFTs"],
        {
          owner: accountAddress,
        },
      );

      return this.ajaxUtils
        .get<alchemyNftResponse>(new URL(url))
        .andThen((response) => {
          const items: EVMNFT[] = response.ownedNfts.map((nft) => {
            return new EVMNFT(
              EVMContractAddress(nft.contract.address),
              BigNumberString(nft.id.tokenId),
              nft.contractMetadata.tokenType,
              EVMAccountAddress(accountAddress),
              TokenUri(nft.tokenUri.gateway),
              { raw: undefined },
              BigNumberString(nft.balance),
              nft.title,
              chainId,
              BlockNumber(Number(nft.contractMetadata.deployedBlockNumber)),
              undefined,
            );
          });
          return okAsync(items);
        });
    });
  }
}

interface IAlchemyNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString;
}

interface INonNativeReponse {
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

interface alchemyNftResponse {
  blockHash: number;
  ownedNfts: alchemyNft[];
  totalCount: number;
}

interface alchemyNft {
  balance: string;
  contract: {
    address: EVMContractAddress;
  };
  contractMetadata: {
    contractDeployer: string;
    deployedBlockNumber: number;
    name: string;
    // openSea: string;
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
  media: alchemyMedia[];
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

interface coinGeckoCall {
  id: string;
  symbol: string;
  name: string;
  error: string;
}

interface alchemyMedia {
  bytes: number;
  format: string;
  gateway: string;
  raw: string;
  thumbnail: string;
}
