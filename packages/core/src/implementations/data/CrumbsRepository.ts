import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtilsType,
  ILogUtils,
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
  TokenId,
  HexString,
  TokenUri,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICrumbsRepository } from "@core/interfaces/data/index.js";
import { CrumbCallData } from "@core/interfaces/objects/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | BlockchainCommonErrors
  > {
    console.log("getCrumb: " + accountAddress);
    return this.getCrumbsContract().andThen((contract) => {
      // Retrieve the crumb id or token id mapped to the address
      // returns 0 if non existent
      console.log("getCrumb contract: " + contract);

      return contract.addressToCrumbId(accountAddress).andThen((tokenId) => {
        console.log("getCrumb tokenId: " + tokenId);

        if (tokenId == null) {
          return okAsync(null);
        }

        // Retrieve the token id's token uri and return it
        // Query reverts with 'ERC721Metadata: URI query for nonexistent token' error if token does not exist
        return contract.tokenURI(tokenId).map((rawTokenUri) => {
          // If the token does not exist (even though it should!)
          console.log("getCrumb rawTokenUri: " + rawTokenUri);

          if (rawTokenUri == null) {
            return null;
          }

          // Token uri will be prefixed with the base uri
          // currently it is www.crumbs.com/ on the deployment scripts
          // alternatively we can also fetch the latest base uri directly from the contract
          const tokenUri = rawTokenUri.match(/\{[\s\S]*\}/)?.[0];

          console.log("getCrumb tokenUri: " + tokenUri);

          // If there is no crumb, there's no data
          if (tokenUri == null) {
            return null;
          }

          // The tokenUri of the crumb is a JSON text, so let's parse it
          const content = JSON.parse(tokenUri) as ICrumbContent;

          // Check if the crumb includes this language code
          const languageCrumb = content[languageCode];

          console.log("getCrumb languageCrumb: " + languageCrumb);

          if (languageCrumb == null) {
            return null;
          }

          // We have a crumb for this language code (the key derived from the signature will be able to decrypt this)
          return new AESEncryptedString(languageCrumb.d, languageCrumb.iv);
        });
      });
    });
  }

  public getCrumbTokenId(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | BlockchainCommonErrors
  > {
    return this.getCrumbsContract().andThen((contract) => {
      return contract.addressToCrumbId(accountAddress);
    });
  }

  public encodeCreateCrumb(
    languageCode: LanguageCode,
    encryptedDataWalletKey: AESEncryptedString,
  ): ResultAsync<CrumbCallData, BlockchainProviderError | UninitializedError> {
    return ResultUtils.combine([
      this.getCrumbsContract(),
      this.cryptoUtils.getTokenId(),
    ]).map(([crumbsContract, crumbId]) => {
      // Create the crumb content
      const crumbContent = TokenUri(
        JSON.stringify({
          [languageCode]: {
            d: encryptedDataWalletKey.data,
            iv: encryptedDataWalletKey.initializationVector,
          },
        } as ICrumbContent),
      );
      return new CrumbCallData(
        crumbsContract.encodeCreateCrumb(crumbId, crumbContent),
        crumbId,
      );
    });
  }

  public encodeBurnCrumb(
    tokenId: TokenId,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getCrumbsContract().map((crumbsContract) => {
      return crumbsContract.encodeBurnCrumb(tokenId);
    });
  }

  public getURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | BlockchainCommonErrors
  > {
    return this.getCrumbsContract().andThen((crumbsContract) => {
      return crumbsContract.tokenURI(tokenId);
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
