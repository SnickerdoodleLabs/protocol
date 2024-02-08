export const questionnaireQuestionTypes = [
    "multiple choice",
    "text",
    "country",
] as const;
export type QuestionnaireQuestionTypes = (typeof questionnaireQuestionTypes)[number];