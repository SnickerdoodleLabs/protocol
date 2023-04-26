import { Metaplex } from "@metaplex-foundation/js";
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
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";
import Web3 from "web3";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class OklinkIndexer implements IEVMAccountBalanceRepository {
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

  private _getOKXConfig(
    chain: ChainId,
  ): ResultAsync<alchemyAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      switch (chain) {
        default:
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
      }
    });
  }

  private getChainShortName(chainId: ChainId): string {
    switch (getChainInfoByChainId(chainId).chain) {
      case EChain.Avalanche:
        return "avaxc";
      default:
        return getChainInfoByChainId(chainId).name;
    }
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getOKXConfig(chainId),
      this.configProvider.getConfig(),
    ])
      .andThen(([okxSettings, config]) => {
        const chainInfo = this.getChainShortName(chainId);
        const url = urlJoinP(
          "https://www.oklink.com/api/v5/explorer/address/",
          ["address-balance-fills"],
          {
            chainShortName: chainInfo.toString(),
            address: accountAddress,
            protocolType: "token_20",
          },
        );

        return this.ajaxUtils.get<IOKXNativeBalanceResponse>(new URL(url), {
          headers: {
            "Ok-Access-Key": config.oklinkApiKey,
          },
        });
      })
      .andThen((response) => {
        if (response.code != "0") {
          return errAsync(
            new AccountIndexingError("Bad url response from Oklink"),
          );
        }
        const balances = response.data[0].tokenList.map((token) => {
          return new TokenBalance(
            EChainTechnology.EVM,
            token.token,
            chainId,
            token.tokenContractAddress,
            accountAddress,
            BigNumberString(Web3.utils.toWei(token.holdingAmount).toString()),
            18,
          );
        });
        return okAsync(balances);
      });
  }
}

interface IOKXNativeBalanceResponse {
  code: string;
  msg: string;
  data: typedData[];
}

interface typedData {
  page: string;
  limit: string;
  totalPage: string;
  chainFullName: string;
  chainShortName: string;
  tokenList: tokenData[];
}

interface tokenData {
  token: TickerSymbol;
  tokenId: string;
  holdingAmount: string; // how much native token you own
  totalTokenValue: string;
  change24h: string;
  priceUsd: BigNumberString; // usd value per token
  valueUsd: BigNumberString; // total usd amount you own
  tokenContractAddress: EVMContractAddress;
}

interface alchemyAjaxSettings {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
}