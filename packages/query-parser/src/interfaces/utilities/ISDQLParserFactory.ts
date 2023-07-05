import {
  IpfsCID,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";

export interface ISDQLParserFactory {
  makeParser(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
}

export const ISDQLParserFactoryType = Symbol.for("ISDQLParserFactory");
