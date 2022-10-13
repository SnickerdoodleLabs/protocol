import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import { IQueryObjectFactory, IQueryObjectFactoryType, ISDQLParserFactory, ISDQLQueryWrapperFactory, ISDQLQueryWrapperFactoryType } from "@query-parser/interfaces";
import { IpfsCID, QueryFormatError, SDQLString } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class SDQLParserFactory implements ISDQLParserFactory {
    
  constructor(
    @inject(IQueryObjectFactoryType)
    readonly queryObjectFactory: IQueryObjectFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
  ) {}

  makeParser(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError> {
    try {
      const schema = this.queryWrapperFactory.makeWrapper(schemaString);
      return okAsync(new SDQLParser(cid, schema, this.queryObjectFactory));
    } catch (e) {
      return errAsync(new QueryFormatError((e as Error).message));
    }
  }
}