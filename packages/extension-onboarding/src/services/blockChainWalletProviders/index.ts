import CoinbaseIcon from "@extension-onboarding/assets/icons/coinbase.svg";
import MetamaskIcon from "@extension-onboarding/assets/icons/metamask.svg";
import PhantomIcon from "@extension-onboarding/assets/icons/phantom.svg";

import WalleConnectIcon from "@extension-onboarding/assets/icons/wallet-connect.svg";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
  CoinbaseWalletProvider,
} from "@extension-onboarding/services/blockChainWalletProviders/connectors";
import { ConfigProvider } from "@extension-onboarding/services/blockChainWalletProviders/implementations/utilities";
import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";

export interface IProvider {
  provider: IWalletProvider;
  icon: any;
  name: string;
  key: EWalletProviderKeys;
  installationUrl: string;
}

const configProvider = new ConfigProvider();
const config = configProvider.getConfig();

export const getProviderList = (): IProvider[] => {
  return [
    {
      provider: new MetamaskWalletProvider(),
      icon: MetamaskIcon,
      name: "MetaMask",
      key: EWalletProviderKeys.METAMASK,
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: PhantomIcon,
      name: "Phantom",
      key: EWalletProviderKeys.PHANTOM,
      installationUrl: "https://phantom.app/download",
    },
    // {
    //   provider: new WalletConnectProvider(),
    //   icon: WalleConnectIcon,
    //   name: "Wallet Connect",
    //   key: EWalletProviderKeys.WALLET_CONNECT,
    //   installationUrl: "",
    // },
    {
      provider: new CoinbaseWalletProvider(),
      icon: CoinbaseIcon,
      name: "Coinbase",
      key: EWalletProviderKeys.COINBASE,
      installationUrl: "https://www.coinbase.com/wallet",
    },
  ];
};
