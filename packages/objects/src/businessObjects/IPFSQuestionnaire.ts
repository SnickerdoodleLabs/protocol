import {
  EQuestionnaireQuestionType,
  EQuestionnarieQuestionDisplayType,
} from "@objects/businessObjects/Questionnaire.js";
import { URLString } from "@objects/primitives/URLString.js";

export interface IPFSQuestionnaire {
  title: string;
  description: string;
  image?: URLString;
  questions: {
    type: EQuestionnaireQuestionType;
    text: string;
    choices?: string[] | number[];
    minumum?: number;
    maximum?: number;
    multiSelect?: boolean;
    required?: boolean;
    displayType?: EQuestionnarieQuestionDisplayType;
    lowerLabel?: string;
    upperLabel?: string;
  }[];
}
