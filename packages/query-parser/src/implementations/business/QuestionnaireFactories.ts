import {
    DataPermissions,
    IpfsCID,
    QueryFormatError,
    SDQLQuery,
    SDQLString,
    UnixTimestamp,
  } from "@snickerdoodlelabs/objects";
  import { inject, injectable } from "inversify";
  import { ResultAsync, errAsync, okAsync } from "neverthrow";
  
  import { AST_Evaluator } from "@query-parser/implementations/business/evaluators/AST_Evaluator.js";
  import { SDQLParser } from "@query-parser/implementations/business/SDQLParser.js";
  import { IQueryFactories } from "@query-parser/interfaces/IQueryFactories.js";
  import {
    IQueryRepository,
    IQueryRepositoryType,
  } from "@query-parser/interfaces/IQueryRepository.js";
  import {
    IQueryObjectFactory,
    IQueryObjectFactoryType,
  } from "@query-parser/interfaces/utilities/IQueryObjectFactory.js";
  import {
    ISDQLQueryWrapperFactory,
    ISDQLQueryWrapperFactoryType,
  } from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory.js";
  
  @injectable()
  export class QuestionnaireFactories implements IQuestionnaireFactories {
    constructor(
      @inject(IQuestionnaireObjectFactoryType)
      readonly questionnaireObjectFactory: IQuestionnaireObjectFactory,
      @inject(ISDQLQuestionnaireWrapperFactoryType)
      readonly questionnaireWrapperFactory: ISDQLQuestionnaireWrapperFactory,
      @inject(IQuestionnaireRepositoryType)
      readonly questionnaireRepository: IQuestionnaireRepository,
    ) {}
  
    public makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser {
      const SDQLWrapper = this.queryWrapperFactory.makeWrapper(
        new SDQLQuery(cid, schemaString),
      );
      return new SDQLParser(cid, SDQLWrapper, this.queryObjectFactory);
    }
  
    public makeParserAsync(
      cid: IpfsCID,
      schemaString: SDQLString,
    ): ResultAsync<SDQLParser, QueryFormatError> {
      try {
        const SDQLWrapper = this.queryWrapperFactory.makeWrapper(
          new SDQLQuery(cid, schemaString),
        );
  
        return okAsync(new SDQLParser(cid, SDQLWrapper, this.queryObjectFactory));
      } catch (e) {
        return errAsync(new QueryFormatError((e as Error).message));
      }
    }
  
    public makeAstEvaluator(
      cid: IpfsCID,
      dataPermissions: DataPermissions,
      queryTimestamp: UnixTimestamp,
    ): AST_Evaluator {
      return new AST_Evaluator(
        cid,
        this.queryRepository,
        dataPermissions,
        queryTimestamp,
      );
    }
  }
  