import {
  DomainName,
  PersistenceError,
  ShoppingDataConnectionStatus,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  IPurchaseRepository,
  IPurchaseRepositoryType,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPurchaseService } from "@core/interfaces/business/IPurchaseService";
@injectable()
export class PurchaseService implements IPurchaseService {
  public constructor(
    @inject(IPurchaseRepositoryType) public purchaseRepo: IPurchaseRepository,
  ) {}
  get(): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.purchaseRepo.get();
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
