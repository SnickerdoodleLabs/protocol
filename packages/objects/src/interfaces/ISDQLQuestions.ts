import { EQuestionType } from "@objects/enum/EQuestionType";
import { ISDQLCallback } from "@objects/interfaces/ISDQLCallback.js";
import {
  ChainId,
  CompensationKey,
  IpfsCID,
  URLString,
  ISDQLConditionString,
} from "@objects/primitives/index.js";

export interface ISDQLQuestions {
  // name: string;
  // image: IpfsCID | URLString | null;
  // description: string;
  // requires?: ISDQLConditionString;
  // chainId: ChainId;
  // callback: ISDQLCallback;
  // alternatives?: CompensationKey[];

  questionType: EQuestionType;
  question: string;
  options: Set<string>; // use index as key
}
