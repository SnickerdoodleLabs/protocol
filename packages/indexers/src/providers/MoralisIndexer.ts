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
  EChainTechnology,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  TickerSymbol,
  TokenBalance,
  TokenUri,
  URLString,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

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
    [
      EChain.BinanceTestnet,
      new IndexerSupportSummary(EChain.BinanceTestnet, true, false, true),
    ],
    [
      EChain.Sepolia,
      new IndexerSupportSummary(EChain.Sepolia, true, false, true),
    ],
  ]);

  protected moralisKey: string | null = null;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (config.apiKeys.moralisApiKey == null) {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
            this.moralisKey = config.apiKeys.moralisApiKey;
          }
        },
      );
    });
  }

  public name(): string {
    return EDataProvider.Moralis;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    if (this.moralisKey == null) {
      return okAsync([]);
    }
    const tokenRequest = this.generateQueryConfig(
      chain,
      accountAddress,
      "erc20",
      this.moralisKey,
    );
    const balanceRequest = this.generateQueryConfig(
      chain,
      accountAddress,
      "balance",
      this.moralisKey,
    );
    return this.contextProvider.getContext().andThen((context) => {
      context.privateEvents.onApiAccessed.next(EExternalApi.Moralis);
      context.privateEvents.onApiAccessed.next(EExternalApi.Moralis);
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
            chain,
            item.token_address,
            accountAddress,
            item.balance,
            item.decimals,
          );
        });
        const chainInfo = getChainInfoByChain(chain);
        tokenBalances.push(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chain,
            MasterIndexer.nativeAddress,
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
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    if (this.moralisKey == null) {
      return okAsync([]);
    }
    const requestConfig = this.generateQueryConfig(
      chain,
      accountAddress,
      "nft",
      this.moralisKey,
    );
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Moralis);
        return this.ajaxUtils.get<IMoralisNFTResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        );
      })
      .andThen((result) => {
        return this.getPages(chain, accountAddress, result);
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from moralis", e),
      );
  }

  public getEVMTransactions(
    chain: EChain,
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

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  private getPages(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    response: IMoralisNFTResponse,
  ): ResultAsync<EVMNFT[], AjaxError> {
    if (this.moralisKey == null) {
      return okAsync([]);
    }

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
        chain,
        BlockNumber(Number(token.block_number)),
        undefined,
      );
    });

    if (response.cursor == null || response.cursor == "") {
      return okAsync(items);
    }

    const requestConfig = this.generateQueryConfig(
      chain,
      accountAddress,
      "nft",
      this.moralisKey,
      response.cursor,
    );

    return this.contextProvider.getContext().andThen((context) => {
      context.privateEvents.onApiAccessed.next(EExternalApi.Moralis);
      return (
        this.ajaxUtils
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .get<IMoralisNFTResponse>(new URL(requestConfig.url!), requestConfig)
          .andThen((next) => {
            return this.getPages(chain, accountAddress, next).andThen(
              (nftArr) => {
                return okAsync(nftArr.concat(items));
              },
            );
          })
      );
    });
  }

  private generateQueryConfig(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    endpoint: string,
    moralisApiKey: string,
    cursor?: string,
    contracts?: EVMContractAddress[],
  ): IRequestConfig {
    const params = {
      format: "decimal",
      chain: `0x${chain.toString(16)}`,
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
    const result: IRequestConfig = {
      method: "get",
      url: url,
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    };
    return result;
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
