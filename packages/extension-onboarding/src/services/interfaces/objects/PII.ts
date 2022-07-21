export class PII {
  constructor(
    public given_name: string | null = null,
    public family_name: string | null = null,
    public email_address: string | null = null,
    public date_of_birth: string | null = null,
    public country_code: string | null = null,
    public phone_number: string | null = null,
    public photo_url: string | null = null,
    public gender: string | null = null,
  ) {}
}
