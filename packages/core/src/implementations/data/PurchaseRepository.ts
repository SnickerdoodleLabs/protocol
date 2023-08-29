import {
  PersistenceError,
  DomainName,
  ERecordKey,
} from "@snickerdoodlelabs/objects";
import {
  IPurchaseRepository,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data";

@injectable()
export class PurchaseRepository implements IPurchaseRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}
  public add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord<PurchasedProduct>(
      ERecordKey.PURCHASED_PRODUCT,
      purchase,
    );
  }

  public get(): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.persistence.getAll<PurchasedProduct>(
      ERecordKey.PURCHASED_PRODUCT,
    );
  }

  public getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.persistence.getAllByIndex<PurchasedProduct>(
      ERecordKey.PURCHASED_PRODUCT,
      "marketPlace",
      marketPlace,
    );
  }
}
