import {
  DomainName,
  PersistenceError,
  ShoppingDataConnectionStatus,
  UnixTimestamp,
  PurchasedProduct,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPurchaseRepository {
  add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError>;
  getPurchasedProducts(): ResultAsync<PurchasedProduct[], PersistenceError>;
  getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError>;
  getByMarketplaceAndDate(
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], PersistenceError>;
  getShoppingDataConnectionStatus(): ResultAsync<
    ShoppingDataConnectionStatus[],
    PersistenceError
  >;
  setShoppingDataConnectionStatus(
    ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
  ): ResultAsync<void, PersistenceError>;
}

export const IPurchaseRepositoryType = Symbol.for("IPurchaseRepository");
