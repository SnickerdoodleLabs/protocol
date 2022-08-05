import { inject, injectable } from "inversify";
import { okAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

import { IPortConnectionService } from "@interfaces/business";
import {
  IPortConnectionRepository,
  IPortConnectionRepositoryType,
} from "@interfaces/data";

@injectable()
export class PortConnectionService implements IPortConnectionService {
  constructor(
    @inject(IPortConnectionRepositoryType)
    protected portRepository: IPortConnectionRepository,
  ) {}

  public connectRemote(connectionPort: Runtime.Port) {
    this.portRepository.connectRemote(connectionPort);
    return okAsync(undefined);
  }
}
