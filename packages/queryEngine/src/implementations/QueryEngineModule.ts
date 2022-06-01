import { IBlockchainListener, IBlockchainListenerType } from "@query-engine/interfaces/api";
import { ContainerModule, interfaces } from "inversify";
import { BlockchainListener } from "@query-engine/implementations/api";

export const queryEngineModule = new ContainerModule(
    (
        bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
    ) => {
        bind<IBlockchainListener>(IBlockchainListenerType)
        	.to(BlockchainListener)
        	.inSingletonScope();
    },
);
