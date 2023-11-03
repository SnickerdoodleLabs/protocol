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
  icon: string;
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
      icon: "https://storage.googleapis.com/dw-assets/spa/icons/metamask.png",
      name: "MetaMask",
      key: EWalletProviderKeys.METAMASK,
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: "https://storage.googleapis.com/dw-assets/spa/icons/phantom.png",
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
      icon: "https://storage.googleapis.com/dw-assets/spa/icons/coinbase.png",
      name: "Coinbase",
      key: EWalletProviderKeys.COINBASE,
      installationUrl: "https://www.coinbase.com/wallet",
    },
  ];
};
