import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import {
  BigNumberString,
  BlockchainProviderError,
  EVMAccountAddress,
  EVMPrivateKey,
  MinimalForwarderContractError,
  Signature,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMetatransactionForwarderRepository } from "@core/interfaces/data/index.js";
import { MetatransactionRequest } from "@core/interfaces/objects/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class MetatransactionForwarderRepository
  implements IMetatransactionForwarderRepository
{
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContractFactoryType) protected contractFactory: IContractFactory,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getNonce(
    accountAddress?: EVMAccountAddress,
  ): ResultAsync<
    BigNumberString,
    BlockchainProviderError | UninitializedError | MinimalForwarderContractError
  > {
    return ResultUtils.combine([
      this.contractFactory.factoryMinimalForwarderContract(),
      this.contextProvider.getContext(),
    ]).andThen(([contract, context]) => {
      if (accountAddress != undefined) {
        return contract.getNonce(accountAddress);
      }
      if (context.dataWalletAddress != null) {
        return contract.getNonce(EVMAccountAddress(context.dataWalletAddress));
      }

      return errAsync(
        new UninitializedError(
          "Cannot get nonce for forwarder; no account address provided and data wallet address not established",
        ),
      );
    });
  }

  public signMetatransactionRequest(
    request: MetatransactionRequest,
    signingKey: EVMPrivateKey,
  ): ResultAsync<Signature, UninitializedError> {
    // We need to take the types, and send it to the account signer
    const value = {
      to: request.to, // Contract address for the metatransaction
      from: request.from, // EOA to run the transaction as (linked account, not derived)
      value: request.value, // The amount of doodle token to pay. Should be 0.
      gas: request.gas, // The amount of gas to pay.
      nonce: request.nonce, // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
      data: request.data, // The actual bytes of the request, encoded as a hex string
    } as IMinimalForwarderRequest;

    return this.configProvider.getConfig().andThen((config) => {
      return this.cryptoUtils.signTypedData(
        getMinimalForwarderSigningDomain(
          config.controlChainId,
          config.controlChainInformation.metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        value,
        signingKey,
      );
    });
  }
}
