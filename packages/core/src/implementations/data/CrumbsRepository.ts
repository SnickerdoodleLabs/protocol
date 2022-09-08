import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICrumbsContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  LanguageCode,
  BlockchainProviderError,
  EVMAccountAddress,
  AESEncryptedString,
  UninitializedError,
  CrumbsContractError,
  ICrumbContent,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICrumbsRepository } from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";

@injectable()
export class CrumbsRepository implements ICrumbsRepository {
  protected crumbsContract: ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > | null = null;

  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    BlockchainProviderError | UninitializedError | CrumbsContractError
  > {
    return this.getCrumbsContract().andThen((contract) => {
      // Retrieve the crumb id or token id mapped to the address
      // returns 0 if non existent
      return contract.addressToCrumbId(accountAddress).andThen((tokenId) => {
        if (tokenId == null) {
          return okAsync(null);
        }
        // Retrieve the token id's token uri and return it
        // Query reverts with 'ERC721Metadata: URI query for nonexistent token' error if token does not exist
        return contract.tokenURI(tokenId).map((rawTokenUri) => {
          // If the token does not exist (even though it should!)
          if (rawTokenUri == null) {
            return null;
          }

          // Token uri will be prefixed with the base uri
          // currently it is www.crumbs.com/ on the deployment scripts
          // alternatively we can also fetch the latest base uri directly from the contract
          const tokenUri = rawTokenUri.match(/\{[\s\S]*\}/)?.[0];

          // If there is no crumb, there's no data
          if (tokenUri == null) {
            return null;
          }

          // The tokenUri of the crumb is a JSON text, so let's parse it
          const content = JSON.parse(tokenUri) as ICrumbContent;

          // Check if the crumb includes this language code
          const languageCrumb = content[languageCode];

          if (languageCrumb == null) {
            return null;
          }

          // We have a crumb for this language code (the key derived from the signature will be able to decrypt this)
          return new AESEncryptedString(languageCrumb.d, languageCrumb.iv);
        });
      });
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
