import { ISDQLQuestionnaireClause } from "@objects/interfaces/ISDQLQuestionnaireClause.js";

export interface ISDQLQuestionnaireBlock {
  [questionId: string]: ISDQLQuestionnaireClause;
}
