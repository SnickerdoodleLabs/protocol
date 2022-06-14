import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import {
  ChainId,
  BlockchainProviderError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IConfigProvider,
  IConfigProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) { }
  public getDataWalletSigner(): ResultAsync<
    JsonRpcSigner,
    BlockchainProviderError | UninitializedError
  > {
    throw new Error("Method not implemented.");
  }

  public getProvider(
    chainId?: ChainId,
  ): ResultAsync<JsonRpcProvider, BlockchainProviderError> {
    throw new Error("Method not implemented.");
  }
}
