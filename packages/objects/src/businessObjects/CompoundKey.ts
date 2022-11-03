export class CompoundKey {
  public constructor(public prefix, public fields: string[]) {}
  public getKey(obj: object): string {
    return `${this.prefix}-${this.fields
      .map((field) => obj[field].toString())
      .join("-")}`;
  }
}
