import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
} from "@extension-onboarding/services/providers/connectors";
import MetamaskIcon from "@extension-onboarding/assets/icons/metamask.svg";
import PhantomIcon from "@extension-onboarding/assets/icons/phantom.svg";
import WalleConnectIcon from "@extension-onboarding/assets/icons/wallet-connect.svg";
import { CoinbaseWalletProvider } from "./connectors/CoinbaseWalletProvider";

export interface IProvider {
  provider: IWalletProvider;
  icon: any;
  name: string;
  key: string;
  installationUrl: string;
}

export const getProviderList = (): IProvider[] => {
  return [
    {
      provider: new MetamaskWalletProvider(),
      icon: MetamaskIcon,
      name: "MetaMask",
      key:'metamask',
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: PhantomIcon,
      name: "Phantom",
      key:'phantom',
      installationUrl: "https://phantom.app/download",
    },
    {
      provider: new WalletConnectProvider(),
      icon: WalleConnectIcon,
      name: "Wallet Connect",
      key: 'walletConnect',
      installationUrl: "",
    },
    {
      provider: new CoinbaseWalletProvider(),
      icon: WalleConnectIcon,
      name: "Coinbase",
      key: 'coinbase',
      installationUrl: "",
    },
  ];
};
