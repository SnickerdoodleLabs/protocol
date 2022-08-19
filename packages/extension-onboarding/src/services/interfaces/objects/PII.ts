import {
  CountryCode,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export class PII {
  constructor(
    public given_name: GivenName | null = null,
    public family_name: FamilyName | null = null,
    public email_address: EmailAddressString | null = null,
    public date_of_birth: string | null = null,
    public country_code: CountryCode | null = null,
    public phone_number: string | null = null,
    public photo_url: string | null = null,
    public gender: Gender | null = null,
  ) {}
}
