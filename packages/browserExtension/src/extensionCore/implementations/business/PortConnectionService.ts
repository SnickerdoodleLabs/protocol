import { IPortConnectionService } from "@interfaces/business";
import { IPortConnectionRepository } from "@interfaces/data";
import { okAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";
export class PortConnectionService implements IPortConnectionService {
  constructor(protected portRepository: IPortConnectionRepository) {}

  public connectRemote(connectionPort: Runtime.Port) {
    this.portRepository.connectRemote(connectionPort);
    return okAsync(undefined);
  }
}
