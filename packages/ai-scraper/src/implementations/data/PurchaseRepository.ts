import { PersistenceError, DomainName } from "@snickerdoodlelabs/objects";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { ResultAsync } from "neverthrow";

import { IPurchaseRepository } from "@ai-scraper/interfaces/index.js";

export class PurchaseRepository implements IPurchaseRepository {
  public add(purchase: PurchasedProduct): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  public get(): ResultAsync<PurchasedProduct[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  public getByMarketplace(
    marketPlace: DomainName,
  ): ResultAsync<PurchasedProduct[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
