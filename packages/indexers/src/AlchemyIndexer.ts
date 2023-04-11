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
} from "@snickerdoodlelabs/objects";
import { TokenMetadataResponse } from "alchemy-sdk";
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

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

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

  /* Fetching ETH Balance from Chains */
  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return this.configProvider.getConfig().andThen((config) => {
      const url = config.alchemyEndpoints[chainInfo.name.toString()];
      console.log("url: ", url);

      return this.ajaxUtils
        .post<IAlchemyNativeBalanceResponse>(
          new URL(url),
          JSON.stringify({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [accountAddress, "latest"],
          }),
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        )
        .andThen((response) => {
          console.log("Alchemy native response: ", response);
          const weiValue = parseInt(response.result, 16).toString();
          chainInfo.nativeCurrency.symbol;

          const balance = new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1), // this should not be the case, we should be adding by symbols
            null,
            accountAddress,
            BigNumberString(weiValue),
            chainInfo.nativeCurrency.decimals,
          );
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
      console.log("url: ", url);

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
          console.log("Alchemy non native response: ", response);
          const balances = response.result.tokenBalances.map((entry) => {
            const weiValue = parseInt(entry.tokenBalance, 16).toString();

            let contractSymbol = this._addressMapping.get(
              entry.contractAddress,
            );
            console.log("contractSymbol: ", contractSymbol);
            if (!contractSymbol) {
              contractSymbol = TickerSymbol("");
            }
            return new TokenBalance(
              EChainTechnology.EVM,
              contractSymbol,
              chainId,
              entry.contractAddress,
              accountAddress,
              BigNumberString(weiValue),
              chainInfo.nativeCurrency.decimals,
            );
          });
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
      // return [nativeBalance];
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

interface INonNativeReponse {
  jsonrpc: number;
  id: number;
  result: {
    address: EVMAccountAddress;
    tokenBalances: ITokenBalance[];
  };
}

interface INativeReponse {
  jsonrpc: number;
  id: number;
  result: HexString;
}

interface ITokenBalance {
  contractAddress: EVMContractAddress;
  tokenBalance: HexString;
}

interface IAlchemyNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString;
}

interface alchemyAjaxSettings {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
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

interface alchemyMedia {
  bytes: number;
  format: string;
  gateway: string;
  raw: string;
  thumbnail: string;
}
