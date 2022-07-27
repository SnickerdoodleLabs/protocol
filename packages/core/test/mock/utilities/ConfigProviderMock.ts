import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

export class ConfigProviderMock implements IConfigProvider {

    
    protected config: CoreConfig;

    constructor() {
        
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
            "covalent api key",
            "moralis api key",
        );
    }

    getConfig(): ResultAsync<CoreConfig, never> {

    }

    setConfigOverrides(overrides: IConfigOverrides): void {

    }

}