import { DerivationMask, Signature } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { EthereumAccount } from "@core/interfaces/objects";

export interface IDerivationMaskUtils {
  getRandomDerivationMask(): ResultAsync<DerivationMask, never>;
  calculateDerivationMask(
    signature: Signature,
    sourceEntropy: string,
  ): ResultAsync<DerivationMask, never>;
  calculateSourceEntropy(
    signature: Signature,
    derivationMask: DerivationMask,
  ): ResultAsync<string, never>;
  getEthereumAccountFromEntropy(
    sourceEntropy: string,
  ): ResultAsync<EthereumAccount, never>;
}

export const IDerivationMaskUtilsType = Symbol.for("IDerivationMaskUtils");
