export interface ISDQLQuestionBlock { 
  questionType: EQuestionType;
  question: string;
  options: string[]; // use index as key
}

export enum EQuestionType {
    multipleChoice = "multiple choice",
    text = "text",
    country = "country"
}

