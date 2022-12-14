import { ITokenPriceRepository } from "@interfaces/data";
import { IErrorUtils, IErrorUtilsType } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  ChainId,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  TokenAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class TokenPriceRepository implements ITokenPriceRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    // @TODO check coingecko server timezone
    date: Date = new Date(),
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core.getTokenPrice(chainId, address, date).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
