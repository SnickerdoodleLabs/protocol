import { 
 EQuestionnaireQuestionType
 } from "@objects/businessObjects";

export interface ISDQLQuestionBlock { 
  questionType: EQuestionnaireQuestionType;
  question: string;
  options: string[]; // use index as key
}

