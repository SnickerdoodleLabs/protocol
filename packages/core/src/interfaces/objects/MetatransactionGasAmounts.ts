export class MetatransactionGasAmounts {
  public constructor(
    public createCrumbGas: number,
    public removeCrumbGas: number,
    public optInGas: number,
    public optOutGas: number,
    public updateAgreementFlagsGas: number,
  ) {}
}
