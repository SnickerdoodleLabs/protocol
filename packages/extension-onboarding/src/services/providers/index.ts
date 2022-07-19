import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
} from "@extension-onboarding/services/providers/connectors";
import MetamaskIcon from "@extension-onboarding/assets/icons/metamask.svg";
import PhantomIcon from "@extension-onboarding/assets/icons/phantom.svg";
import WalleConnectIcon from "@extension-onboarding/assets/icons/wallet-connect.svg";
import coinbase from "@extension-onboarding/assets/icons/coinbase.svg";
import { CoinbaseWalletProvider } from "./connectors/CoinbaseWalletProvider";
import { EWalletProviderKeys } from "@extension-onboarding/constants";

export interface IProvider {
  provider: IWalletProvider;
  icon: any;
  name: string;
  key: EWalletProviderKeys;
  installationUrl: string;
}

export const getProviderList = (): IProvider[] => {
  return [
    {
      provider: new MetamaskWalletProvider(),
      icon: MetamaskIcon,
      name: "MetaMask",
      key:EWalletProviderKeys.METAMASK,
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: PhantomIcon,
      name: "Phantom",
      key:EWalletProviderKeys.PHANTOM,
      installationUrl: "https://phantom.app/download",
    },
    {
      provider: new WalletConnectProvider(),
      icon: WalleConnectIcon,
      name: "Wallet Connect",
      key: EWalletProviderKeys.WALLET_CONNECT,
      installationUrl: "",
    },
    {
      provider: new CoinbaseWalletProvider(),
      icon: coinbase,
      name: "Coinbase",
      key: EWalletProviderKeys.COINBASE,
      installationUrl: "",
    },
  ];
};
