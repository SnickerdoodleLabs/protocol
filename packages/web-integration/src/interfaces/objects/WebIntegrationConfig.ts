import { LanguageCode, URLString } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

export class WebIntegrationConfig {
  public constructor(
    public signer: ethers.Signer | null,
    public iframeUrl: URLString,
    public languageCode: LanguageCode,
  ) {}
}
