import { IProvider } from "@browser-extension/services/providers";
import { createContext} from "react";
import { AnySchema } from "yup";

export interface IProviderList{
    providerList : any,
    setProviderList : any
}

export const ProviderContext = createContext<IProviderList | null>(null);