import {
  DataWalletAddress,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  IQueryEngineEvents,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements IQueryEngineEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQuery>;
  public onAccountAdded: Subject<EVMAccountAddress>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onTransaction: Subject<EVMTransaction>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
  }
}
