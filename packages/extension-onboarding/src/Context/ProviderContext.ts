import { IProvider } from "@extension-onboarding/services/providers";
import { createContext} from "react";

export interface ILinkedAccounts{
    name: string;
    key: string;
    accountAddress: string;
}

export interface IProviderContext{
    linkedAccounts? : ILinkedAccounts[],
    setLinkedAccounts? : any,
    providerList?:IProvider
}

export const ProviderContext = createContext<IProviderContext | null >(null);