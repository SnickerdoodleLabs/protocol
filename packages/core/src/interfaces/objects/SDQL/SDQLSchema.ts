export class SDQLSchema {
  /**
   * A object created from string
   */

  constructor(readonly internalObj: Object) {}

  static fromString(s: string): SDQLSchema {
    console.log("S: ", s)
    //const obj = JSON.parse(s);
    return new SDQLSchema(s);
  }

  public get version(): string {
    return `${this.internalObj["version"]}`;
  }

  public get description(): string {
    return this.internalObj["description"];
  }

  public get business(): string {
    return this.internalObj["business"];
  }

  getQuerySchema(): Object {
    return this.internalObj["queries"];
  }

  getReturnSchema(): { url: string } {
    return this.internalObj["returns"];
  }
  getCompensationSchema(): Object {
    return this.internalObj["compensations"];
  }
  getLogicSchema(): Object {
    return this.internalObj["logic"];
  }
}
