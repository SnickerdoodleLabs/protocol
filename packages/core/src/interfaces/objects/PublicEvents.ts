import {
  DataWalletAddress,
  EthereumAccountAddress,
  EthereumContractAddress,
  EthereumTransaction,
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
  public onTransaction: Subject<EthereumTransaction>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
  }
}
