import { PersistenceError, DomainName } from "@snickerdoodlelabs/objects";
import { IPersistence, IPersistenceType } from "@snickerdoodlelabs/persistence";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPurchaseRepository } from "@ai-scraper/interfaces/index.js";

@injectable()
export class PurchaseRepository implements IPurchaseRepository {
  public constructor(
    @inject(IPersistenceType)
    protected persistence: IPersistence,
  ) {}
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
