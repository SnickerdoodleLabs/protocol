import { ISDQLQuestionBlock } from "@objects/interfaces/ISDQLQuestionBlock.js";

export interface ISDQLQuestionsBlock {
  [questionId: string]: ISDQLQuestionBlock;
}
