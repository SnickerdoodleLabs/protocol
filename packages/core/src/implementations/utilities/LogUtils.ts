import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

//import { CoreConfig } from "../../../../core/src/interfaces/objects";
import { IConfigProvider, ILogUtils } from "@core/interfaces/utilities";
import { CoreConfig } from "../../../src/interfaces/objects";

declare const __CONTROL_CHAIN_ID__: number | undefined;

@injectable()
export class LogUtils implements IConfigProvider {
    protected config: CoreConfig;

    public constructor(
        config?: Partial<CoreConfig>

    ) {


    }

    public getConfig(): ResultAsync<CoreConfig, never> {
        return okAsync(this.config);
    }
}
