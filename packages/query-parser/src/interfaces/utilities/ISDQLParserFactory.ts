import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import { IpfsCID, QueryFormatError, SDQLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLParserFactory {
  makeParser(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
}
  
export const ISDQLParserFactoryType = Symbol.for("ISDQLParserFactory");