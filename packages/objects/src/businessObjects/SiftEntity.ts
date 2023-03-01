import {
  URLString,
  DomainName,
  UnixTimestamp,
  SiftEntityLabel,
} from "@objects/primitives";

/**
 * Represents a visit to a particular Url
 */
export class SiftEntity {
  public constructor(
    public label: SiftEntityLabel,
    public metadata: string,
    public status: number,
  ) {}

  public domain: DomainName | undefined;
}
