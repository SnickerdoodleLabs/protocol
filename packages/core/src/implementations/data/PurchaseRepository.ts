import {
  PersistenceError,
  DomainName,
  ERecordKey,
  UnixTimestamp,
  EFieldKey,
  ShoppingDataConnectionStatus,
} from "@snickerdoodlelabs/objects";
import {
  IPurchaseRepository,
  IPurchaseUtils,
  IPurchaseUtilsType,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";

@injectable()
export class PurchaseRepository implements IPurchaseRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IPurchaseUtilsType)
    protected purchaseUtils: IPurchaseUtils,
  ) {}
  public add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError> {
    return this.getByMarketplaceAndDate(
      purchase.marketPlace,
      purchase.datePurchased,
    ).andThen((existingPurchases) => {
      return this.purchaseUtils
        .contains(existingPurchases, purchase)
        .andThen((contains) => {
          if (contains) {
            return okAsync(undefined);
          }
          return this.persistence.updateRecord<PurchasedProduct>(
            ERecordKey.PURCHASED_PRODUCT,
            purchase,
          );
        });
    });
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
  public getByMarketplaceAndDate(
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.persistence.getAllByMultiIndex<PurchasedProduct>(
      ERecordKey.PURCHASED_PRODUCT,
      ["marketPlace", "datePurchased"],
      [marketPlace, datePurchased],
    );
  }
  public getShoppingDataConnectionStatus(): ResultAsync<
    ShoppingDataConnectionStatus[],
    PersistenceError
  > {
    return this.persistence.getAll<ShoppingDataConnectionStatus>(
      ERecordKey.SHOPPING_DATA_CONNECTION_STATUS,
    );
  }

  public setShoppingDataConnectionStatus(
    ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord<ShoppingDataConnectionStatus>(
      ERecordKey.SHOPPING_DATA_CONNECTION_STATUS,
      ShoppingDataConnectionStatus,
    );
  }
}
