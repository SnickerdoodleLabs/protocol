import {
  DataWalletAddress,
  EthereumAccountAddress,
  IQueryEngineEvents,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements IQueryEngineEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQuery>;
  public onAccountAdded: Subject<EthereumAccountAddress>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
  }
}
