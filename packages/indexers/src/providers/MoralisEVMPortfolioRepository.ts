import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  BlockNumber,
  ChainId,
  EChainTechnology,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  getChainInfoByChainId,
  IEVMIndexer,
  TickerSymbol,
  TokenBalance,
  TokenUri,
  URLString,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class MoralisEVMPortfolioRepository implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, false, false),
    ],
    [
      EChain.Moonbeam,
      new IndexerSupportSummary(EChain.Moonbeam, true, false, false),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, true, false, false),
    ],
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, true, false, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    return ResultUtils.combine([
      this.generateQueryConfig(chainId, accountAddress, "erc20"),
      this.generateQueryConfig(chainId, accountAddress, "balance"),
    ]).andThen(([tokenRequest, balanceRequest]) => {
      return ResultUtils.combine([
        this.ajaxUtils.get<IMoralisBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(tokenRequest.url!),
          tokenRequest,
        ),
        this.ajaxUtils.get<IMoralisNativeBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(balanceRequest.url!),
          balanceRequest,
        ),
      ]).map(([tokenResponse, balanceResponse]) => {
        const tokenBalances = tokenResponse.map((item) => {
          return new TokenBalance(
            EChainTechnology.EVM,
            item.symbol,
            chainId,
            item.token_address,
            accountAddress,
            item.balance,
            item.decimals,
          );
        });
        const chainInfo = getChainInfoByChainId(chainId);
        tokenBalances.push(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            null,
            accountAddress,
            balanceResponse.balance,
            chainInfo.nativeCurrency.decimals,
          ),
        );
        return tokenBalances;
      });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return this.generateQueryConfig(chainId, accountAddress, "nft")
      .andThen((requestConfig) => {
        return this.ajaxUtils
          .get<IMoralisNFTResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .andThen((result) => {
            return this.getPages(chainId, accountAddress, result);
          });
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from moralis", e),
      );
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AjaxError | AccountIndexingError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getEVMTransactions not supported for Moralis Indexer",
        400,
      ),
    );
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (config.apiKeys.moralisApiKey == "") {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
          }
        },
      );
      return okAsync(this.health);
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  private getPages(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    response: IMoralisNFTResponse,
  ): ResultAsync<EVMNFT[], AjaxError> {
    const items: EVMNFT[] = response.result.map((token) => {
      return new EVMNFT(
        EVMContractAddress(token.token_address),
        BigNumberString(token.token_id),
        token.contract_type,
        EVMAccountAddress(token.owner_of),
        TokenUri(token.token_uri),
        { raw: token.metadata },
        BigNumberString(token.amount),
        token.name,
        chainId,
        BlockNumber(Number(token.block_number)),
        undefined,
      );
    });

    if (response.cursor == null || response.cursor == "") {
      return okAsync(items);
    }

    return this.generateQueryConfig(
      chainId,
      accountAddress,
      "nft",
      response.cursor,
    ).andThen((requestConfig) => {
      return (
        this.ajaxUtils
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .get<IMoralisNFTResponse>(new URL(requestConfig.url!), requestConfig)
          .andThen((next) => {
            return this.getPages(chainId, accountAddress, next).andThen(
              (nftArr) => {
                return okAsync(nftArr.concat(items));
              },
            );
          })
      );
    });
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    endpoint: string,
    cursor?: string,
    contracts?: EVMContractAddress[],
  ): ResultAsync<IRequestConfig, never> {
    const params = {
      format: "decimal",
      chain: `0x${chainId.toString(16)}`,
    };
    if (contracts != undefined) {
      params["token_addresses"] = contracts.toString();
    }
    if (cursor != undefined) {
      params["cursor"] = cursor;
    }

    const url = urlJoinP(
      "https://deep-index.moralis.io",
      ["api", "v2", accountAddress.toString(), endpoint],
      params,
    );
    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.moralisApiKey,
        },
      };
      return result;
    });
  }
}

interface IMoralisNFTResponse {
  total: number;
  page: number;
  page_size: number;
  status: string;
  cursor: string | null;

  result: {
    token_address: string;
    token_id: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_hash: string;
    amount: string;
    updated_at: string;
    contract_type: string;
    name: string;
    symbol: string;
    token_uri: string;
    metadata: string;
  }[];

  last_token_uri_sync: string | null;
  last_metadata_sync: string | null;
}

type IMoralisBalanceResponse = {
  token_address: EVMContractAddress;
  name: string;
  symbol: TickerSymbol;
  logo: URLString | null;
  thumbnail: URLString | null;
  decimals: number;
  balance: BigNumberString;
}[];

interface IMoralisNativeBalanceResponse {
  balance: BigNumberString;
}
