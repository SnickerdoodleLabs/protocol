import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface Keywords {
  [languageCode: string]: TaskKeywords;
}
