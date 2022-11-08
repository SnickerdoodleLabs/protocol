export class VolatileTableIndex {
  public constructor(
    public name: string,
    public keyPath: string,
    public autoIncrement: boolean = false,
    public indexBy?: [string, boolean][],
    public disableBackup: boolean = false,
  ) {}
}
