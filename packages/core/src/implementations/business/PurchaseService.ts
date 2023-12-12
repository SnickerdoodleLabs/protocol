import {
  DomainName,
  PersistenceError,
  ShoppingDataConnectionStatus,
  UnixTimestamp,
  PurchasedProduct,
} from "@snickerdoodlelabs/objects";
import {
  IPurchaseRepository,
  IPurchaseRepositoryType,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPurchaseService } from "@core/interfaces/business/IPurchaseService";
@injectable()
export class PurchaseService implements IPurchaseService {
  public constructor(
    @inject(IPurchaseRepositoryType) public purchaseRepo: IPurchaseRepository,
  ) {}
  getPurchasedProducts(): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.purchaseRepo.getPurchasedProducts();
  }
  getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.purchaseRepo.getByMarketplace(marketPlace);
  }
  getByMarketplaceAndDate(
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.purchaseRepo.getByMarketplaceAndDate(
      marketPlace,
      datePurchased,
    );
  }
  getShoppingDataConnectionStatus(): ResultAsync<
    ShoppingDataConnectionStatus[],
    PersistenceError
  > {
    return this.purchaseRepo.getShoppingDataConnectionStatus();
  }
  setShoppingDataConnectionStatus(
    ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
  ): ResultAsync<void, PersistenceError> {
    return this.purchaseRepo.setShoppingDataConnectionStatus(
      ShoppingDataConnectionStatus,
    );
  }
}
