import {
    SDQL_Name,
    QuestionnaireQuestionTypes,
    questionnaireQuestionTypes,
    EQuestionnaireQuestionType,
    IpfsCID,
  } from "@snickerdoodlelabs/objects";
    
  export abstract class AST_Question {
    constructor(
      question: SDQL_Name,
      readonly questionType: EQuestionnaireQuestionType.MultipleChoice,
      readonly possibleResponses: string[],
      readonly questionnaireIndex: IpfsCID,
      readonly questionIndex: number,
      answer: string | number | undefined,
    ) {}
  
    static identifyQuestionnaireType(
      questionnaireType: string,
    ): QuestionnaireQuestionTypes | undefined {
      return questionnaireQuestionTypes.find((validType) => {
        return validType === questionnaireType;
      });
    } 
  }
  

  import {
    ESDQLQueryReturn,
    EWalletDataType,
    ISDQLQueryClause,
    ISDQLTimestampRange,
    MissingWalletDataTypeError,
    SDQL_Name,
    SDQL_OperatorName,
    Web2QueryTypes,
  } from "@snickerdoodlelabs/objects";
  import { Result, err, ok } from "neverthrow";
  
  import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";
  import {
    BinaryCondition,
    ConditionE,
    ConditionG,
    ConditionGE,
    ConditionIn,
    ConditionL,
    ConditionLE,
  } from "@query-parser/interfaces/objects/condition/index.js";
  
  export class AST_QuestionnaireQuery extends AST_SubQuery {
    /**
     * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
     * @param property - the name of the query from the schema, e.g., "age"
     */
  
    constructor(
      readonly name: SDQL_Name,
      readonly returnType: ESDQLQueryReturn.Object,
      readonly property: EQuestionnaireQuestionType,
      readonly conditions: Array<BinaryCondition>, // needed?
      // readonly timestampRange?: ISDQLTimestampRange,
      readonly questionType: EQuestionnaireQuestionType,
      readonly possibleResponses: string[],
      readonly questionnaireIndex: IpfsCID,
      readonly questionIndex: number,
      answer: string | number | undefined,
    ) {
      super(name, returnType);
    }

    static fromSchema(
      name: SDQL_Name,
      schema: ISDQLQueryClause,
    ): AST_QuestionnaireQuery {
      const conditions = AST_QuestionnaireQuery.parseConditions(schema.conditions);
      return new AST_QuestionnaireQuery(
        name,
        schema.return,
        schema.name as Web2QueryTypes,
        conditions,
        schema.enum_keys,
        schema.patternProperties,
        schema.timestampRange,
      );
    }

    static getWeb3QueryTypeIfValidQueryType(
      queryType: string,
    ): Web3QueryTypes | undefined {
      return web3QueryTypes.find((validType) => {
        return validType === queryType;
      });
    }
  }
  
  