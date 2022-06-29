import {
  DerivationMask,
  EthereumAccountAddress,
  EthereumPrivateKey,
  Signature,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  PublicEvents,
  CoreContext,
  EthereumAccount,
} from "@core/interfaces/objects";
import { IDerivationMaskUtils } from "@core/interfaces/utilities";

@injectable()
export class DerivationMaskUtils implements IDerivationMaskUtils {
  getRandomDerivationMask(): ResultAsync<DerivationMask, never> {
    return okAsync(DerivationMask("abc"));
    throw new Error("Method not implemented.");
  }
  calculateDerivationMask(
    signature: Signature,
    sourceEntropy: string,
  ): ResultAsync<DerivationMask, never> {
    return okAsync(DerivationMask("abc"));

    throw new Error("Method not implemented.");
  }
  calculateSourceEntropy(
    signature: Signature,
    derivationMask: DerivationMask,
  ): ResultAsync<string, never> {
    return okAsync("abc");

    throw new Error("Method not implemented.");
  }
  getEthereumAccountFromEntropy(
    sourceEntropy: string,
  ): ResultAsync<EthereumAccount, never> {
    return okAsync(
      new EthereumAccount(
        EthereumAccountAddress("123"),
        EthereumPrivateKey("private"),
      ),
    );

    throw new Error("Method not implemented.");
  }
}
