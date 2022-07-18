import { IProvider } from "@browser-extension/services/providers";
import { createContext} from "react";

export interface ILinkedAccounts{
    name: string;
    key: string;
    accountAddress: string;
}

export interface IProviderContext{
    linkedAccounts? : ILinkedAccounts[],
    setLinkedAccounts? : any,
    providerList?:IProvider,
    setProviderList?:any
}

export const ProviderContext = createContext<IProviderContext | null >(null);