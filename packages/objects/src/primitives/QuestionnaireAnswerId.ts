import { Brand, make } from "ts-brand";

export type QuestionnaireAnswerId = Brand<string, "QuestionnaireAnswerId">;
export const QuestionnaireAnswerId = make<QuestionnaireAnswerId>();
