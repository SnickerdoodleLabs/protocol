import {
  ChainId,
  ChainInformation,
  EVMAccountAddress,
  ProviderRpcError,
  Signature,
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IBlockchainProviderRepository } from "@web-integration/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@web-integration/interfaces/utilities/index.js";

@injectable()
export class BlockchainProviderRepository
  implements IBlockchainProviderRepository
{
  protected lastAccount: EVMAccountAddress | null = null;
  protected lastChain: ChainInformation | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getSignature(
    message: string,
  ): ResultAsync<Signature, ProviderRpcError> {
    const config = this.configProvider.getConfig();

    if (config.signer == null) {
      return errAsync(new ProviderRpcError("No signer provided"));
    }

    return ResultAsync.fromPromise(config.signer.signMessage(message), (e) => {
      return new ProviderRpcError(
        `Error while getting signature: ${(e as Error).message}`,
        e,
      );
    }).map((signature) => Signature(signature));
  }

  public getCurrentAccount(): ResultAsync<
    EVMAccountAddress | null,
    ProviderRpcError
  > {
    // If we have a last account, then just return that
    if (this.lastAccount != null) {
      return okAsync(this.lastAccount);
    }

    const config = this.configProvider.getConfig();

    // If there's no signer, there's no current account
    if (config.signer == null) {
      return okAsync(null);
    }

    // If not, we must not even be connected (or are in the process)
    return ResultAsync.fromPromise(config.signer.getAddress(), (e) => {
      return new ProviderRpcError("Unable to obtain address of signer", e);
    }).map((address) => {
      this.lastAccount = EVMAccountAddress(address.toLowerCase());
      return this.lastAccount;
    });
  }

  public getCurrentChain(): ResultAsync<
    ChainInformation | null,
    ProviderRpcError
  > {
    if (this.lastChain != null) {
      return okAsync(this.lastChain);
    }

    const config = this.configProvider.getConfig();

    if (config.signer == null || config.signer.provider == null) {
      return okAsync(null);
    }

    return ResultAsync.fromPromise(config.signer.provider.getNetwork(), (e) => {
      return new ProviderRpcError("Unable to get network from provider", e);
    }).map((network) => {
      this.lastChain = getChainInfoByChainId(ChainId(network.chainId));
      return this.lastChain;
    });
  }
}
