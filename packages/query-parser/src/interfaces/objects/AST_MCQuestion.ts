import {
    SDQL_Name,
    ISDQLQuestionBlock,
    EQuestionType,
  } from "@snickerdoodlelabs/objects";

import { AST_Question } from "@query-parser/interfaces/objects/AST_Question.js";

  export class AST_MCQuestion extends AST_Question {
    constructor(
        readonly name: SDQL_Name,
        readonly questionType: EQuestionType.multipleChoice,
        readonly possibleResponse: Set<string>,
      ) {
        super(name, questionType, possibleResponse);
      }
  
    static fromSchema(name: SDQL_Name, schema: ISDQLQuestionBlock): AST_MCQuestion {
        return new AST_MCQuestion(name, EQuestionType.multipleChoice, schema.options);
    }
  
    // getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    //   return ok(EWalletDataType.AccountNFTs);
    // }
  }
  