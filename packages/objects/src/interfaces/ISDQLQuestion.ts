import { 
  EQuestionnaireQuestionType
} from "@objects/businessObjects";

export interface ISDQLQuestion {
  questionType: EQuestionnaireQuestionType;
  question: string;
  options: string[]; 
}
