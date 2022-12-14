import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { ChainId, TokenAddress } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITokenPriceRepository {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    date?: Date,
  ): ResultAsync<number, SnickerDoodleCoreError>;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");
