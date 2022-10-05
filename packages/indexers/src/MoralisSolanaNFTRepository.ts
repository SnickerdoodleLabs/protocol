import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountNFTError,
  AjaxError,
  ChainId,
  EChain,
  ISolanaNFTRepository,
  SolanaAccountAddress,
  SolanaNFT,
  SolanaNFTMetadata,
  SolanaTokenAddress,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

type SolanaAccountNFTResponse = {
  associatedTokenAddress: string;
  mint: string;
}[];

const chainIdToNetworkId = new Map<ChainId, string>([
  [ChainId(EChain.Solana), "mainnet"],
  [ChainId(EChain.SolanaTestnet), "devnet"],
]);

@injectable()
export class MoralisSolanaNFTRepository implements ISolanaNFTRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AjaxError | AccountNFTError> {
    if (!chainIdToNetworkId.has(chainId)) {
      return errAsync(
        new AccountNFTError(
          "No solana network ID mapping exists for: " + chainId,
        ),
      );
    }

    return this._getAccountNFTsQuery(chainId, accountAddress).andThen(
      (query) => {
        return (
          this.ajaxUtils
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .get<SolanaAccountNFTResponse>(new URL(query.url!), query)
            .andThen((response) => {
              return ResultUtils.combine(
                response.map((item) => {
                  return this._getNFTQuery(
                    chainId,
                    item.associatedTokenAddress,
                  ).andThen((itemQuery) => {
                    return this.ajaxUtils
                      .get<SolanaNFTMetadata>(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        new URL(itemQuery.url!),
                        itemQuery,
                      )
                      .andThen((metadata) => {
                        return okAsync(
                          new SolanaNFT(
                            chainId,
                            accountAddress,
                            SolanaTokenAddress(item.associatedTokenAddress),
                            item.mint,
                            metadata,
                          ),
                        );
                      });
                  });
                }),
              );
            })
        );
      },
    );
  }

  private _getAccountNFTsQuery(
    chainId: ChainId,
    address: SolanaAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    const url = urlJoin("https://solana-gateway.moralis.io", [
      "account",
      chainIdToNetworkId[chainId],
      address,
      "nft",
    ]);

    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.moralisApiKey,
        },
      };
      return result;
    });
  }

  private _getNFTQuery(
    chainId: ChainId,
    tokenAddress: string,
  ): ResultAsync<IRequestConfig, never> {
    const url = urlJoin("https://solana-gateway.moralis.io", [
      "nft",
      chainIdToNetworkId[chainId],
      tokenAddress,
      "metadata",
    ]);

    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.moralisApiKey,
        },
      };
      return result;
    });
  }
}
