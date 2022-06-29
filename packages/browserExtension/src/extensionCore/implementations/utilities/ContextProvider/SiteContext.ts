export class SiteContext {
  // dummy
  constructor(protected scamList: string[] = ["https://www.facebook.com"]) {}

  public getScamList() {
    return this.scamList;
  }

  public setScamList(scamList: string[]) {
    this.scamList = scamList;
  }
}
