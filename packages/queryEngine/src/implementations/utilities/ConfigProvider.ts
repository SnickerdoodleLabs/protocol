import { IConfigProvider } from "@query-engine/interfaces/utilities";
import { QueryEngineConfig } from "@query-engine/interfaces/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ChainId, URLString } from "@snickerdoodlelabs/objects";

@injectable()
export class ConfigProvider implements IConfigProvider {
    getConfig(): ResultAsync<QueryEngineConfig, never> {
        return okAsync(new QueryEngineConfig(
            ChainId(1337),
            URLString("")));
    }
}