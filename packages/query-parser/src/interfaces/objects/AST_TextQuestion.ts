import {
    EWalletDataType,
    ISDQLQueryClause,
    ESDQLQueryReturn,
    SDQL_Name,
    MissingWalletDataTypeError,
    ISDQLQuestionBlock,
    EQuestionType,
    EQuestionnaireQuestionType,
  } from "@snickerdoodlelabs/objects";
  import { AST_Question } from "@query-parser/interfaces/objects/AST_Question.js";

  import { ok, Result } from "neverthrow";
  
  export class AST_TextQuestion extends AST_Question {
    constructor(
        readonly name: SDQL_Name,
        readonly questionType: EQuestionnaireQuestionType,
        readonly possibleResponses: string[],
      ) {
        super(name, questionType, possibleResponses);
      }
    
      static fromSchema(name: SDQL_Name, schema: ISDQLQuestionBlock): AST_TextQuestion {
        return new AST_TextQuestion(name, EQuestionnaireQuestionType.MultipleChoice, schema.options);
      }
  
    // getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    //   return ok(EWalletDataType.AccountNFTs);
    // }
  }