import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

@injectable()
export class ConfigProvider implements IConfigProvider, IIndexerConfigProvider {
  protected config: CoreConfig;

  public constructor(@inject(ILogUtilsType) protected logUtils: ILogUtils) {
    const controlChainId = ChainId(31337);
    const controlChainInformation = chainConfig.get(controlChainId);

    if (controlChainInformation == null) {
      throw new Error(
        `Invalid configuration! No ChainInformation exists for control chain ${controlChainId}`,
      );
    }

    if (!(controlChainInformation instanceof ControlChainInformation)) {
      throw new Error(
        `Invalid configuration! Control chain ${controlChainInformation} is not a ControlChainInformation`,
      );
    }

    this.config = new CoreConfig(
      controlChainId,
      [], //TODO: supported chains
      URLString(""),
      chainConfig,
      controlChainInformation,
      URLString("ipfs node address"),
      // uncomment following line to test locally
      // URLString("http://localhost:3000/v0"),
      URLString("http://insight-platform"),
      snickerdoodleSigningDomain,
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      "covalent api key",
      "moralis api key",
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config = { ...this.config, ...overrides };
  }
}
