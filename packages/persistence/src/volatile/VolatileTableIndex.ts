import { VolatileStorageKey } from "@snickerdoodlelabs/objects";

export class VolatileTableIndex {
  public constructor(
    public name: string,
    public keyPath: string | string[],
    public autoIncrement: boolean = false,
    public indexBy?: [string | string[], boolean][],
    public disableBackup: boolean = false,
  ) {}
}
