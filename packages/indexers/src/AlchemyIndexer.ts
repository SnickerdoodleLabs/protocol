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
  private _metadataCache = new Map<
    `${EVMContractAddress}-${ChainId}`,
    TokenMetadataResponse
  >();

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

  private _getAlchemyConfig(
    chain: ChainId,
  ): ResultAsync<alchemyAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("within _getAlchemyConfig: ", chain);
      switch (chain) {
        case ChainId(EChain.Arbitrum):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        case ChainId(EChain.Optimism):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        default:
          return errAsync(
            new AccountIndexingError("no alchemy app for chainId", chain),
          );
      }
    });
  }

  private _getAlchemyNftConfig(
    chain: ChainId,
  ): ResultAsync<alchemyAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      switch (chain) {
        case ChainId(EChain.Arbitrum):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getNFTs",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        case ChainId(EChain.Optimism):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getNFTs",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        default:
          return errAsync(
            new AccountIndexingError("no alchemy app for chainId", chain),
          );
      }
    });
  }

  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return ResultUtils.combine([
      this._getAlchemyConfig(chainId),
      this.configProvider.getConfig(),
    ]).andThen(([alchemySettings, config]) => {
      const url = config.alchemyEndpoints[chainInfo.name.toString()];
      return this.ajaxUtils
        .post<unknown>(new URL(url), JSON.stringify(alchemySettings), {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          console.log("response: ", JSON.stringify(response));
          const resp = response as IAlchemyNativeBalanceResponse;
          const weiValue = parseInt(resp.result, 16).toString();

          const balance = new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            null,
            accountAddress,
            BigNumberString(weiValue),
            chainInfo.nativeCurrency.decimals,
          );

          console.log("balance: ", balance);

          return okAsync(balance);
        });
    });
  }

  private getNonNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.getNonNativeBalance(chainId, accountAddress),
      this.getNativeBalance(chainId, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      console.log("nativeBalance: ", nativeBalance);
      return [nativeBalance];
      //   return [nativeBalance, ...nonNativeBalance];
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return ResultUtils.combine([
      this._getAlchemyNftConfig(chainId),
      this.configProvider.getConfig(),
    ]).andThen(([alchemySettings, config]) => {
      console.log("alchemySettings: ", alchemySettings);
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
          console.log("response: ", response);
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
          console.log("items: ", items);
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
