import { IBlockchainProvider, IConfigProvider, IConfigProviderType, ILogUtils, ILogUtilsType } from "@query-engine/interfaces/utilities";
import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { ChainId, BlockchainUnavailableError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { combine, ResultAsync } from "neverthrow";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
    public constructor(@inject(IConfigProviderType) protected configProvider: IConfigProvider,
        @inject(ILogUtilsType) protected logUtils: ILogUtils) { }
    public getSigner(chainId: ChainId): ResultAsync<JsonRpcSigner, BlockchainUnavailableError> {
        throw new Error("Method not implemented.");
    }
    public getProvider(chainId?: ChainId): ResultAsync<JsonRpcProvider, BlockchainUnavailableError> {
        throw new Error("Method not implemented.");
    }
}