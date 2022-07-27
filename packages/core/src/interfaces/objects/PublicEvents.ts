import {
  DataWalletAddress,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  ISnickerdoodleCoreEvents,
  MetatransactionSignatureRequest,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements ISnickerdoodleCoreEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<{consentContractAddress:EVMContractAddress, query:SDQLQuery}>;
  public onAccountAdded: Subject<EVMAccountAddress>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onTransaction: Subject<EVMTransaction>;
  public onMetatransactionSignatureRequested: Subject<MetatransactionSignatureRequest>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
    this.onMetatransactionSignatureRequested = new Subject();
  }
  
}
