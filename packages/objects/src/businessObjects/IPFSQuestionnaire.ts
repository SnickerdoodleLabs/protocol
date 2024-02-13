import { EQuestionnaireQuestionType } from "@objects/businessObjects/Questionnaire.js";
import { URLString } from "@objects/primitives/URLString.js";

export interface IPFSQuestionnaire {
  title: string;
  description: string;
  image?: URLString;
  questions: {
    questionType: EQuestionnaireQuestionType;
    question: string;
    choices?: string[];
    required?: boolean;
  }[];
}
