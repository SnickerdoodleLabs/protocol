import { EQueryEvents, EStatus } from "@objects/enum/index.js";
import { IpfsCID, SDQL_Name } from "@objects/primitives/index.js";

/**
 * Important Note on Evaluation Events:
 */
export class QuestionnairePerformanceEvent {
  constructor(
    public type: EQueryEvents,
    public status: EStatus,
    public queryCID: IpfsCID,
    public subQueryIdentifier?: SDQL_Name,
    public error?: Error,
  ) {}
}
