import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface IQueryEngine {
    initialize(): ResultAsync<void, never>;
    addData(): ResultAsync<void, never>;

    onInterestingThing: Observable<number>;
}