import { ChainId, EVMAccountAddress } from "@objects/primitives";

export class EVMEvent {
  public constructor(
    public txHash: string,
    public rawData: string,
    public raw_log_topics: string[] | null,
    public sender_contract_decimals: number | null,
    public sender_name: string | null,
    public sender_contract_ticker_symbol: string | null,
    public sender_address: string,
    public sender_address_label: string | null,
    public sender_logo_url: string | null,
    public raw_log_data: string,
    public decoded: {
      name: string;
      signature: string;
      params:
        | {
            name: string;
            type: string;
            indexed: boolean;
            decoded: boolean;
            value: string;
          }[]
        | null;
    } | null,
  ) {}
}
