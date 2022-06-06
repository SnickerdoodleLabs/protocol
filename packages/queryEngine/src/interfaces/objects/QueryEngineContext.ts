// This is basically global variables

import { SDQLQuery } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class QueryEngineContext {
    public constructor(
        public onQueryPosted: Subject<SDQLQuery>
    ) {}
}