import {
  DataWalletAddress,
  EVMContractAddress,
  EVMTransaction,
  ISnickerdoodleCoreEvents,
  LinkedAccount,
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements ISnickerdoodleCoreEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQueryRequest>;
  public onQueryAccepted: Subject<SDQLQueryRequest>;
  public onAccountAdded: Subject<LinkedAccount>;
  public onAccountRemoved: Subject<LinkedAccount>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onTransaction: Subject<EVMTransaction>;
  public onMetatransactionSignatureRequested: Subject<MetatransactionSignatureRequest>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onQueryAccepted = new Subject();
    this.onAccountAdded = new Subject();
    this.onAccountRemoved = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
    this.onMetatransactionSignatureRequested = new Subject();
  }
}
