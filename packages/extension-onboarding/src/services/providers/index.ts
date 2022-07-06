import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
} from "@extension-onboarding/services/providers/connectors";
import MetamaskIcon from "@extension-onboarding/assets/icons/metamask.svg";
import PhantomIcon from "@extension-onboarding/assets/icons/phantom.svg";
import WalleConnectIcon from "@extension-onboarding/assets/icons/wallet-connect.svg";

export interface IProvider {
  provider: IWalletProvider;
  icon: any;
  name: string;
  installationUrl: string;
}

// const providerList: IProvider[] = [
//   {
//     provider: new MetamaskWalletProvider(),
//     icon: MetamaskIcon,
//     name: "MetaMask",
//     installationUrl: "https://metamask.io/",
//   },
//   {
//     provider: new PhantomWalletProvider(),
//     icon: PhantomIcon,
//     name: "Phantom",
//     installationUrl: "https://phantom.app/download",
//   },
//   {
//     provider: new WalletConnectProvider(),
//     icon: WalleConnectIcon,
//     name: "Wallet Connect",
//     installationUrl: "",
//   },
// ];

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
