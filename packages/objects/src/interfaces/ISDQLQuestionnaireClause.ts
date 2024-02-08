import { ISDQLQuestionBlock } from "./ISDQLQuestionBlock";

// Questionnaire Clause Represents one Questionnaire
// It is made up of multiple question blocks
export interface ISDQLQuestionnaireClause {
  items: ISDQLQuestionBlock[];
}