import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  ChainId,
  EChainTechnology,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  getChainInfoByChainId,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  TickerSymbol,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

@injectable()
export class NftScanEVMPortfolioRepository
  implements IEVMNftRepository, IEVMAccountBalanceRepository
{
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
    console.log("getTokensForAccount chainId: ", chainId);
    return this.generateQueryConfig(chainId, accountAddress, "nft")
      .andThen((requestConfig) => {
        console.log("requestConfig: ", requestConfig);
        console.log("requestConfig.url!: ", requestConfig.url!);
        return this.ajaxUtils
          .get<INftScanResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .andThen((result) => {
            console.log("result: ", result);
            return this.getPages(chainId, accountAddress, result);
          });
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from moralis", e),
      );
  }

  private getPages(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    response: INftScanResponse,
  ): ResultAsync<EVMNFT[], AjaxError> {
    const items: EVMNFT[] = response.data.content.map((token) => {
      console.log("token: ", token);
      return new EVMNFT(
        EVMContractAddress(token.contract_address),
        BigNumberString(token.token_id),
        token.erc_type,
        EVMAccountAddress(token.owner),
        TokenUri(token.token_uri),
        { raw: token.metadata_json },
        BigNumberString(token.amount),
        token.name,
        chainId,
      );
    });

    return okAsync(items);

    // console.log("items: ", items);

    // if (response.cursor == null || response.cursor == "") {
    //   return okAsync(items);
    // }

    // return this.generateQueryConfig(
    //   chainId,
    //   accountAddress,
    //   "nft",
    //   response.cursor,
    // ).andThen((requestConfig) => {
    //   console.log("requestConfig: ", requestConfig);
    //   return (
    //     this.ajaxUtils
    //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //       .get<INftScanResponse>(new URL(requestConfig.url!), requestConfig)
    //       .andThen((next) => {
    //         console.log("next: ", next);
    //         return this.getPages(chainId, accountAddress, next).andThen(
    //           (nftArr) => {
    //             console.log("nftArr: ", nftArr);
    //             return okAsync(nftArr.concat(items));
    //           },
    //         );
    //       })
    //   );
    // });
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    endpoint: string,
    cursor?: string,
    contracts?: EVMContractAddress[],
  ): ResultAsync<IRequestConfig, never> {
    // const params = {
    //   format: "decimal",
    //   chain: `0x${chainId.toString(16)}`,
    // };
    // if (contracts != undefined) {
    //   params["token_addresses"] = contracts.toString();
    // }
    // if (cursor != undefined) {
    //   params["cursor"] = cursor;
    // }

    const url = urlJoinP("https://moonbeamapi.nftscan.com", [
      "api",
      "v2",
      "account",
      "own",
      accountAddress.toString() + "?erc_type=erc721",
    ]);
    console.log("url: ", url);
    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.nftScanApiKey,
        },
      };
      return result;
    });
  }
}

interface INftScanResponse {
  code: number;
  data: {
    content: {
      amount: string;
      attributes: string[];
      content_type: string;
      content_uri: string;
      contract_address: string;
      contract_name: string;
      contract_token_id: string;
      erc_type: string;
      external_link: string;
      image_uri: string;
      latest_trade_price: string;
      latest_trade_symbol: string;
      latest_trade_timestamp: UnixTimestamp;
      metadata_json: string;
      mint_price: string;
      mint_timestamp: UnixTimestamp;
      mint_transaction_hash: string;
      minter: string;
      name: string;
      nftscan_id: string;
      nftscan_uri: string;
      own_timestamp: string;
      owner: string;
      rarity_rank: string;
      rarity_score: string;
      token_id: string;
      token_uri: string;
    }[];
  };
  msg: number;
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
