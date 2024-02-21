import {
  EQuestionnaireQuestionType,
  EQuestionnaireQuestionDisplayType,
} from "@objects/businessObjects/Questionnaire.js";
import { URLString } from "@objects/primitives/URLString.js";

export interface IQuestionnaireSchema {
  title: string;
  description: string;
  image?: URLString | null;
  questions: {
    type: EQuestionnaireQuestionType;
    question: string;
    options?: string[] | number[] | null;
    minimum?: number | null;
    maximum?: number | null;
    multiSelect?: boolean;
    isRequired?: boolean | null;
    displayType?: EQuestionnaireQuestionDisplayType | null;
    lowerLabel?: string | null;
    upperLabel?: string | null;
  }[];
}
