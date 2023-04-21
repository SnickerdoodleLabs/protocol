import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMTransaction,
  IEVMTransactionRepository,
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  PolygonTransaction,
  EPolygonTransactionType,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  getChainInfoByChain,
  EVMAccountAddress,
  IEVMAccountBalanceRepository,
  EVMContractAddress,
  EChain,
  HexString,
} from "@snickerdoodlelabs/objects";
import { Connection } from "@solana/web3.js";
import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

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
      console.log("Inside getAlchemyclient chain: ", chain);
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

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
        this._getOKXConfig(chainId),
        this.configProvider.getConfig(),
      ]).andThen(([alchemySettings, config]) => {
        const chainInfo = getChainInfoByChainId(chainId);
        const url = urlJoinP(
          "https://www.oklink.com/api/v5/explorer/address/",
          ["address-balance-fills"],
          {
            chainShortName: chainInfo.name.toString(),
            address: accountAddress,
            protocolType: "token_20",
          },
        );
        console.log("url: ", url);
        return this.ajaxUtils
          .get<IOKXNativeBalanceResponse>(new URL(url), {
            headers: {
              "Ok-Access-Key": config.oklinkApiKey,
            },
          })
          .andThen((response) => {
            const tokenData = response.data[0].tokenList[0];
            // const val = tokenData.holdingAmount * 10 ** 18;
            const balances = response.data[0].tokenList.map((token) => {
                return okAsync(
                    new TokenBalance(
                      EChainTechnology.EVM,
                      token.token,
                      chainId,
                      token.tokenContractAddress,
                      accountAddress,
                      BigNumberString((token.holdingAmount * 10 ** 18).toString()),
                      18,
                    ),
                  );
            })
            return okAsync(balances);
          });
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
  holdingAmount: number; // how much native token you own
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