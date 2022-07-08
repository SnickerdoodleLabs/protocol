import {
  IAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICrumbsContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  LanguageCode,
  BlockchainProviderError,
  TokenId,
  EVMAccountAddress,
  AESEncryptedString,
  UninitializedError,
  ConsentContractError,
  EncryptedString,
  InitializationVector,
  EVMPrivateKey,
  AjaxError,
  DataWalletAddress,
  ICrumbContent,
} from "@snickerdoodlelabs/objects";
import { addCrumbTypes } from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { ILoginRegistryRepository } from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProviderType,
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
    @inject(IAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getCrumbsContract()
      .andThen((contract) => {
        return contract.getCrumb(accountAddress);
      })
      .map((tokenUri) => {
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

        // We have a crumb for this langauge code (the key derived from the signature will be able to decrypt this)
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
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    encryptedDataWalletKey: AESEncryptedString,
    languageCode: LanguageCode,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<TokenId, AjaxError> {
    // We don't even need to check the existing crumb. We're going to make a request to the insight platform
    // to add a crumb for us. What we need to do is generate a request and sign it.
    return this.configProvider.getConfig().andThen((config) => {
      const value = {
        accountAddress: accountAddress,
        data: encryptedDataWalletKey.data,
        initializationVector: encryptedDataWalletKey.initializationVector,
        languageCode: languageCode,
      } as Record<string, unknown>;

      return this.cryptoUtils
        .signTypedData(
          config.snickerdoodleProtocolDomain,
          addCrumbTypes,
          value,
          dataWalletKey,
        )
        .andThen((signature) => {
          const url = new URL(
            urlJoin(
              config.defaultInsightPlatformBaseUrl,
              "crumb",
              encodeURIComponent(accountAddress),
            ),
          );

          return this.ajaxUtils.post<TokenId>(url, {
            dataWallet: dataWalletAddress,
            data: encryptedDataWalletKey.data,
            initializationVector: encryptedDataWalletKey.initializationVector,
            languageCode: languageCode,
            signature: signature,
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