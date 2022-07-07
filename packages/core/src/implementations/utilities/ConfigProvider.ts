import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ConfigProvider implements IConfigProvider {
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
      URLString(""),
      chainConfig,
      controlChainInformation,
      URLString("ipfs node address"),
      URLString("http://insight-platform"),
      {
        name: "Snickerdoodle Protocol",
        version: "1",
      } as TypedDataDomain,
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config = { ...this.config, ...overrides };
  }
}
