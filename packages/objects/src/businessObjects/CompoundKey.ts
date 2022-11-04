export class CompoundKey {
  public constructor(public prefix, public fields: string[]) {}
  public getKey(obj: object): string {
    const key = this.fields.map((field) => obj[field].toString()).join("-");
    return `${this.prefix}-${key}`;
  }
}
