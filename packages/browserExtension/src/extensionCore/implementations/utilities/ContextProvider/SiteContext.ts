import { IScamList } from "@shared/objects/State";

export class SiteContext {
  // dummy
  constructor(
    protected scamList: IScamList[] = [
      {
        safeURL: "https://www.shrapnel.com",
        scamURL: "https://sketchy.snickerdoodle.dev",
      },
    ],
    protected whiteList: string[] = ["https://www.shrapnel.com"],
    protected yellowList: string[] = [],
  ) {}

  public getScamList() {
    return this.scamList;
  }

  public setScamList(scamList: IScamList[]) {
    this.scamList = scamList;
  }

  public getWhiteList() {
    return this.whiteList;
  }

  public setWhiteList(whiteList: string[]) {
    this.whiteList = whiteList;
  }

  public getYellowList() {
    return this.yellowList;
  }

  public setYellowList(yellowList: string[]) {
    this.yellowList = yellowList;
  }
}
