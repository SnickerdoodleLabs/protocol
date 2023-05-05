import { SDQLParser } from "@query-parser/implementations/business/SDQLParser.js";
import {
  IQueryObjectFactory,
  IQueryObjectFactoryType,
} from "@query-parser/interfaces/index.js";
import { ISDQLParserFactory } from "@query-parser/interfaces/utilities/ISDQLParserFactory.js";
import {
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory.js";
import {
  IpfsCID,
  QueryFormatError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

@injectable()
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
      const schema = this.queryWrapperFactory.makeWrapper(
        new SDQLQuery(cid, schemaString),
      );
      return okAsync(new SDQLParser(cid, schema, this.queryObjectFactory));
    } catch (e) {
      return errAsync(new QueryFormatError((e as Error).message));
    }
  }
}
