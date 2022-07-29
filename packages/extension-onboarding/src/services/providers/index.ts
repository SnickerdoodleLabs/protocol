import MetamaskIcon from "@extension-onboarding/assets/icons/metamask.svg";
import PhantomIcon from "@extension-onboarding/assets/icons/phantom.svg";
import WalleConnectIcon from "@extension-onboarding/assets/icons/wallet-connect.svg";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
} from "@extension-onboarding/services/providers/connectors";
import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";

export interface IProvider {
  provider: IWalletProvider;
  icon: any;
  name: string;
  installationUrl: string;
}

export const getProviderList = (): IProvider[] => {
  return [
    {
      provider: new MetamaskWalletProvider(),
      icon: MetamaskIcon,
      name: "MetaMask",
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: PhantomIcon,
      name: "Phantom",
      installationUrl: "https://phantom.app/download",
    },
    {
      provider: new WalletConnectProvider(),
      icon: WalleConnectIcon,
      name: "Wallet Connect",
      installationUrl: "",
    },
  ];
};
