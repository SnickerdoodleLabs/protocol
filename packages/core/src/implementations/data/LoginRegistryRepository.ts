import {
  EVMAccountAddress,
  LanguageCode,
  BlockchainProviderError,
  TokenId,
  AESEncryptedString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ILoginRegistryRepository } from "@core/interfaces/data";

@injectable()
export class LoginRegistryRepository implements ILoginRegistryRepository {
  public getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<AESEncryptedString | null, BlockchainProviderError> {
    throw new Error("Method not implemented.");
  }

  public addCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
    encryptedDataWalletKey: AESEncryptedString,
  ): ResultAsync<TokenId, BlockchainProviderError> {
    throw new Error("Method not implemented.");
  }
}
