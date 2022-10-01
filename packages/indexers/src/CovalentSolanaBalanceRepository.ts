import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountBalanceError,
  AjaxError,
  BigNumberString,
  ChainId,
  EChain,
  EVMAccountAddress,
  ISolanaBalanceRepository,
  SolanaAccountAddress,
  SolanaBalance,
  SolanaContractAddress,
  SolanaTokenAddress,
  TickerSymbol,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoinP, urlJoin } from "url-join-ts";

import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository";
import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider";

interface ICovalentSolanaBalanceResponse {
  data: {
    address: EVMAccountAddress;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: ChainId;
    items: {
      contract_decimals: number;
      contract_name: string;
      contract_ticker_symbol: TickerSymbol;
      contract_address: SolanaTokenAddress;
      supports_erc: boolean | null;
      logo_url: URLString;
      last_transferred_at: string | null;
      native_token: boolean;
      type: string;
      balance: BigNumberString;
      balance_24h: BigNumberString | null;
      quote_rate: number;
      quote_rate_24h: number;
      quote: number;
      quote_24h: number | null;
      nft_data: object | null;
    }[];
    pagination: object | null;
  };
  error: boolean;
  error_message: string | null;
  error_code: string | number | null; //not sure
}

export class CovalentSolanaBalanceRepository
  implements ISolanaBalanceRepository
{
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaBalance[], AccountBalanceError | AjaxError> {
    let covalentChainId: ChainId | null = null;
    if (chainId == EChain.Solana) {
      covalentChainId = ChainId(1399811149);
    } else if (chainId == EChain.SolanaTestnet) {
      return okAsync([]); // Testnet is not supported
    } else {
      return errAsync(
        new AccountBalanceError("Non-solana chain ID: " + chainId),
      );
    }

    return this.generateQueryConfig(covalentChainId, accountAddress).andThen(
      (request) => {
        return (
          this.ajaxUtils
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .get<ICovalentSolanaBalanceResponse>(new URL(request.url!), request)
            .andThen((response) => {
              return okAsync(
                response.data.items.map(
                  (item) =>
                    new SolanaBalance(
                      item.contract_ticker_symbol,
                      chainId,
                      item.balance,
                      item.contract_address,
                      accountAddress,
                      item.quote,
                    ),
                ),
              );
            })
        );
      },
    );
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    return this.configProvider.getConfig().map((config) => {
      const params = {
        key: config.covalentApiKey,
        "quote-currency": config.quoteCurrency,
        nft: false,
      };

      const paramString = urlJoinP(undefined, [], params);

      const url = urlJoin(
        "https://api.covalenthq.com",
        "v1",
        chainId.toString(),
        "address",
        accountAddress,
        "balances_v2",
        paramString, // needs to be assembled separately to preserve trailing slash
      );

      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: { Accept: "application/json" },
      };
      return result;
    });
  }
}
