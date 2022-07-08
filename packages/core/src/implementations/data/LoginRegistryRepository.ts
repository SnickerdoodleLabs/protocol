import { ICrumbsContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  LanguageCode,
  BlockchainProviderError,
  TokenId,
  EVMAccountAddress,
  AESEncryptedString,
  UninitializedError,
  CrumbsContractError,
  EncryptedString,
  InitializationVector,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ILoginRegistryRepository } from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";

@injectable()
export class LoginRegistryRepository implements ILoginRegistryRepository {
  protected crumbsContract: ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > | null = null;

  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    BlockchainProviderError | UninitializedError | CrumbsContractError
  > {
    return this.getCrumbsContract()
      .andThen((contract) => {
        // Retrieve the crumb id or token id mapped to the address
        // returns 0 if non existent
        return contract.addressToCrumbId(accountAddress), contract;
      })
      .andThen((tokenId, contract) => {
        // Retrieve the token id's token uri and return it
        // Query reverts with 'ERC721Metadata: URI query for nonexistent token' error if token does not exist
        return contract.tokenURI(tokenId);
      })
      .map((rawTokenUri) => {
        // Token uri will be prefixed with the base uri
        // currently it is www.crumbs.com/ on the deployment scripts
        // alternatively we can also fetch the latest base uri directly from the contract

        let tokenUri = rawTokenUri.replace("www.crumbs.com/", "");

        // If there is no crumb, there's no data
        if (tokenUri == null) {
          return null;
        }

        // The tokenUri of the crumb is a JSON text, so let's parse it
        const content = JSON.parse(tokenUri) as CrumbContent;

        // Check if the crumb includes this language code
        const languageCrumb = content[languageCode];

        if (languageCrumb == null) {
          return null;
        }

        // We have a crumb for this language code (the key derived from the signature will be able to decrypt this)
        return new AESEncryptedString(languageCrumb.d, languageCrumb.iv);
      });
  }

  /**
   * Adds or updates the on-chain crumb. This is actually a little complicated as we need to do it via the
   * Insight Platform
   * @param accountAddress
   * @param encryptedDataWalletKey
   * @param languageCode
   * @returns
   */
  public addCrumb(
    accountAddress: EVMAccountAddress,
    encryptedDataWalletKey: AESEncryptedString,
    languageCode: LanguageCode,
  ): ResultAsync<
    TokenId,
    BlockchainProviderError | UninitializedError | CrumbsContractError
  > {
    // First, get the existing crumb
    return this.getCrumbsContract()
      .andThen((contract) => {
        return contract.getCrumb(accountAddress);
      })
      .andThen((tokenUri) => {
        // If there is no tokenUri, we are the first; if there is one, we need to add the new language code to it
        if (tokenUri == null) {
          // No existing crumb at all
          // Create the crumb content
          const crumbContent = JSON.stringify({
            [languageCode]: {
              d: encryptedDataWalletKey.data,
              iv: encryptedDataWalletKey.initializationVector,
            },
          } as CrumbContent);

          // TODO
          // Send the crumb to the Insight Platform to be created
          return okAsync(TokenId(BigInt(0)));
        }

        // There is an existing crumb, update it
        const content = JSON.parse(tokenUri) as CrumbContent;
        content[languageCode] = {
          d: encryptedDataWalletKey.data,
          iv: encryptedDataWalletKey.initializationVector,
        };

        // TODO: Send the crumb to the insight platform to be created
        return okAsync(TokenId(BigInt(0)));
      });
  }

  protected getCrumbsContract(): ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > {
    if (this.crumbsContract == null) {
      this.crumbsContract = this.contractFactory.factoryCrumbsContract();
    }
    return this.crumbsContract;
  }
}

type CrumbContent = {
  [languageCode: LanguageCode]: {
    d: EncryptedString;
    iv: InitializationVector;
  };
};
