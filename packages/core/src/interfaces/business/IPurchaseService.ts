import {
  DomainName,
  PersistenceError,
  PurchasedProduct,
  ShoppingDataConnectionStatus,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPurchaseService {
  get(): ResultAsync<PurchasedProduct[], PersistenceError>;
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

export const IPurchaseServiceType = Symbol.for("IPurchaseService");
