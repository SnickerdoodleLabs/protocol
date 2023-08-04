import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EFieldKey,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IEntropyRepository } from "@core/interfaces/data/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/IDataWalletPersistence.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class EntropyRepository implements IEntropyRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public getDataWalletPrivateKey(): ResultAsync<
    ExternallyOwnedAccount | null,
    PersistenceError
  > {
    return this.persistence
      .getField<EVMPrivateKey>(EFieldKey.DATA_WALLET_PRIVATE_KEY)
      .map((dataWalletPrivateKey) => {
        if (dataWalletPrivateKey == null || dataWalletPrivateKey == "") {
          return null;
        }
        const accountAddress =
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            dataWalletPrivateKey,
          );
        return new ExternallyOwnedAccount(accountAddress, dataWalletPrivateKey);
      });
  }
  public createDataWalletPrivateKey(): ResultAsync<
    ExternallyOwnedAccount,
    PersistenceError
  > {
    return this.cryptoUtils
      .createEthereumPrivateKey()

      .map((dataWalletPrivateKey) => {
        const accountAddress =
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            dataWalletPrivateKey,
          );
        return new ExternallyOwnedAccount(accountAddress, dataWalletPrivateKey);
      });
  }

  public setDataWalletPrivateKey(
    dataWalletPrivateKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Save the private key
    return this.persistence
      .updateField(EFieldKey.DATA_WALLET_PRIVATE_KEY, dataWalletPrivateKey)
      .map(() => {});
  }
}
