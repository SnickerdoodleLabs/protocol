import {
    SDQL_Name,
    ISDQLQuestionBlock,
    EQuestionType,
    StorageKey,
    EQuestionnaireQuestionType,
  } from "@snickerdoodlelabs/objects";

import { AST_Question } from "@query-parser/interfaces/objects/AST_Question.js";

  export class AST_MCQuestion extends AST_Question {
    constructor(
        readonly name: SDQL_Name,
        readonly questionType: EQuestionnaireQuestionType.MultipleChoice,
        readonly possibleResponses: string[],
      ) {
        super(name, questionType, possibleResponses);
      }
  
    static fromSchema(name: SDQL_Name, schema: ISDQLQuestionBlock): AST_MCQuestion {
        return new AST_MCQuestion(name, EQuestionnaireQuestionType.MultipleChoice, schema.options);
    }
  
    // getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    //   return ok(EWalletDataType.AccountNFTs);
    // }
  }
  