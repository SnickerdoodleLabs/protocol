import {
  DataWalletAddress,
  EthereumAccountAddress,
  EthereumContractAddress,
  IQueryEngineEvents,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements IQueryEngineEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQuery>;
  public onAccountAdded: Subject<EthereumAccountAddress>;
  public onCohortJoined: Subject<EthereumContractAddress>;
  public onCohortLeft: Subject<EthereumContractAddress>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
  }
}
