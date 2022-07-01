import { IPortConnectionService } from "@interfaces/business";
import { IPortConnectionRepository } from "@interfaces/data";
import { okAsync } from "neverthrow";
export class PortConnectionService implements IPortConnectionService{
  constructor(protected portRepository: IPortConnectionRepository) {}

  public connectRemote(connectionPort) {
    this.portRepository.connectRemote(connectionPort)
    return okAsync(undefined);
  }
}
