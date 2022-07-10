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
import { injectable, inject } from "inversify";
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
      URLString("http://insight-platform"),
      {
        name: "Snickerdoodle Protocol",
        version: "1",
      } as TypedDataDomain,
      5000, // polling interval
      "covalent api key",
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config = { ...this.config, ...overrides };
  }
}
