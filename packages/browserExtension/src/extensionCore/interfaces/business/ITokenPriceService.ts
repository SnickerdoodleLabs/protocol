import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { ChainId, TokenAddress } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITokenPriceService {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    date?: Date,
  ): ResultAsync<number, SnickerDoodleCoreError>;
}

export const ITokenPriceServiceType = Symbol.for("ITokenPriceService");
