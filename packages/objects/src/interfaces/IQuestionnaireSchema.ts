import {
  EQuestionnaireQuestionType,
  EQuestionnaireQuestionDisplayType,
} from "@objects/businessObjects/Questionnaire.js";
import { URLString } from "@objects/primitives/URLString.js";

// TODO version validation
export interface IQuestionnaireSchema {
  title: string;
  description?: string;
  image?: URLString;
  questions: {
    questionType: EQuestionnaireQuestionType;
    question: string;
    displayType?: EQuestionnaireQuestionDisplayType;
    multiSelect?: boolean;
    isRequired?: boolean;
    lowerLabel?: string;
    upperLabel?: string;
    minimum?: number;
    maximum?: number;
    options?: string[] | number[];
  }[];
}
