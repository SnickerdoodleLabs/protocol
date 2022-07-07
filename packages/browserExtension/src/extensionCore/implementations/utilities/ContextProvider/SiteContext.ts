import { IScamList } from "@shared/objects/State";

export class SiteContext {
  // dummy
  constructor(
    protected scamList: IScamList[] = [
      {
        safeURL: "https://www.shrapnel.com",
        scamURL: "https://sketchy.snickerdoodle.dev",
      },
      {
        safeURL: "https://traderjoexyz.com",
        scamURL: "https://www.traderjoe.com",
      },
      {
        safeURL: "https://pancakeswap.finance",
        scamURL: "https://pancake.finance",
      },
      {
        safeURL: "https://crabada.com",
        scamURL: "https://cradaba.com",
      },
      {
        safeURL: "https://pangolin.exchange",
        scamURL: "https://pangolin.xyz",
      },
      {
        safeURL: "https://uniswap.org",
        scamURL: "https://xn--unswap-xva.app",
      },
      {
        safeURL: "https://uniswap.org",
        scamURL: "https://uniswap.app",
      },
    ],
    protected whiteList: string[] = [
      "https://www.shrapnel.com",
      "https://traderjoexyz.com",
      "https://uniswap.org",
      "https://pangolin.exchange",
      "https://crabada.com",
      "https://market.crabada.com",
      "https://pancake.finance",
      "https://www.traderjoexyz.com",
      "https://www.uniswap.org",
      "https://www.pangolin.exchange",
      "https://www.crabada.com",
      "https://www.pancake.finance",
      "https://www.market.crabada.com",
    ],
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
