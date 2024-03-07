import {
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@objects/businessObjects/Questionnaire.js";
import { QueryStatus } from "@objects/businessObjects/versioned/QueryStatus.js";
import { EQueryProcessingStatus } from "@objects/enum/EQueryProcessingStatus.js";
import {
  BlockNumber,
  EVMContractAddress,
  IpfsCID,
  JSONString,
  UnixTimestamp,
} from "@objects/primitives/index.js";
import { URLString } from "@objects/primitives/URLString.js";
import { PropertiesOf } from "@objects/utilities/index.js";
export class Offer
  implements PropertiesOf<Omit<QueryStatus, "getVersion" | "CURRENT_VERSION">>
{
  public constructor(
    public name: string,
    public description: string,
    public image: URLString,
    public points: number,
    public questionnaires: (Questionnaire | QuestionnaireWithAnswers)[],

    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public receivedBlock: BlockNumber,
    public status: EQueryProcessingStatus,
    public expirationDate: UnixTimestamp,
    public rewardsParameters: JSONString | null,
  ) {}
}
