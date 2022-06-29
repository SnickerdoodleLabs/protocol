import {
  EthereumAccountAddress,
  LanguageCode,
  DerivationMask,
  BlockchainProviderError,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ILoginRegistryRepository } from "@core/interfaces/data";

@injectable()
export class LoginRegistryRepository implements ILoginRegistryRepository {
  getDerivationMask(
    accountAddress: EthereumAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<DerivationMask | null, BlockchainProviderError> {
    return okAsync(null);
  }
  addDerivationMask(
    accountAddress: EthereumAccountAddress,
    languageCode: LanguageCode,
    derivationMask: DerivationMask,
  ): ResultAsync<TokenId, BlockchainProviderError> {
    return okAsync(TokenId(BigInt(4)));
  }
}
