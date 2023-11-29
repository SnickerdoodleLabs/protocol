import {
  DomainName,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  PersistenceError,
  PurchasedProduct,
  ShoppingDataConnectionStatus,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPurchaseService } from "@synamint-extension-sdk/core/interfaces/business/IPurchaseService";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";

@injectable()
export class PurchaseService implements IPurchaseService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  get(): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.core.purchase.get().mapErr((error) => {
      this.errorUtils.emit(error);
      return new PersistenceError((error as Error).message, error);
    });
  }
  getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.core.purchase.getByMarketplace(marketPlace).mapErr((error) => {
      this.errorUtils.emit(error);
      return new PersistenceError((error as Error).message, error);
    });
  }
  getByMarketplaceAndDate(
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    return this.core.purchase
      .getByMarketplaceAndDate(marketPlace, datePurchased)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new PersistenceError((error as Error).message, error);
      });
  }

  getShoppingDataConnectionStatus(): ResultAsync<
    ShoppingDataConnectionStatus[],
    PersistenceError
  > {
    return this.core.purchase
      .getShoppingDataConnectionStatus()
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new PersistenceError((error as Error).message, error);
      });
  }
  setShoppingDataConnectionStatus(
    ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
  ): ResultAsync<void, PersistenceError> {
    return this.core.purchase
      .setShoppingDataConnectionStatus(ShoppingDataConnectionStatus)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new PersistenceError((error as Error).message, error);
      });
  }
}
