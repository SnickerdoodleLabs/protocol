import { EQuestionType } from "@objects/enum/EQuestionType";
import { ISDQLCallback } from "@objects/interfaces/ISDQLCallback.js";
import {
  ChainId,
  CompensationKey,
  IpfsCID,
  URLString,
  ISDQLConditionString,
} from "@objects/primitives/index.js";

export interface ISDQLQuestion {
  questionType: EQuestionType;
  question: string;
  options: string[]; 
}
