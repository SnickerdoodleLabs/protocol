export interface ISDQLQuestionBlock { 
  questionType: EQuestionType;
  question: string;
  options: Set<string>; // use index as key
}

export enum EQuestionType {
    multipleChoice = "multiple choice",
    text = "text",
    country = "country"
}

