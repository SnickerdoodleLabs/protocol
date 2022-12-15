import { ITokenPriceService } from "@interfaces/business";
import {
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@interfaces/data";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  ChainId,
  TokenAddress,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class TokenPriceService implements ITokenPriceService {
  constructor(
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepository: ITokenPriceRepository,
  ) {}
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.tokenPriceRepository.getTokenPrice(chainId, address, timestamp);
  }
}
