export class SiteContext {
  // dummy
  constructor(
    protected scamList: string[] = ["https://www.facebook.com"],
    protected whiteList: string[] = [],
  ) {}

  public getScamList() {
    return this.scamList;
  }

  public setScamList(scamList: string[]) {
    this.scamList = scamList;
  }

  public getWhiteList() {
    return this.whiteList;
  }

  public setWhiteList(whiteList: string[]) {
    this.whiteList = whiteList;
  }
}
