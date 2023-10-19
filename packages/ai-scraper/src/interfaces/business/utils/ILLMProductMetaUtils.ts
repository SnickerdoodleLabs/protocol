import {
    LLMError,
    DomainName,
    ELanguageCode,
    LLMAnswerStructure,
    LLMQuestion,
    LLMResponse,
    LLMRole,
  } from "@snickerdoodlelabs/objects";
  import { ProductMeta } from "@snickerdoodlelabs/shopping-data";
  import { ResultAsync } from "neverthrow";
  
  export interface ILLMProductMetaUtils {
    getRole(): LLMRole;
    getQuestion(): LLMQuestion;
    getAnswerStructure(): LLMAnswerStructure;
  
    parseMeta (
      domain: DomainName,
      language: ELanguageCode,
      llmResponse: LLMResponse,
    ): ResultAsync<ProductMeta[], LLMError>;
  }
  
  export const ILLMProductMetaUtilsType = Symbol.for(
    "ILLMProductMetaUtils",
  );
  