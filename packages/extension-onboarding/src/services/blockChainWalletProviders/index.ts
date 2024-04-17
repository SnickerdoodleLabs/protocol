import { EWalletProviderKeys } from "@extension-onboarding/constants";
import {
  MetamaskWalletProvider,
  PhantomWalletProvider,
  WalletConnectProvider,
  CoinbaseWalletProvider,
} from "@extension-onboarding/services/blockChainWalletProviders/connectors";
import { ConfigProvider } from "@extension-onboarding/services/blockChainWalletProviders/implementations/utilities";
import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { EChainTechnology } from "@snickerdoodlelabs/objects";

export interface IProvider {
  provider: IWalletProvider;
  icon: string;
  name: string;
  key: EWalletProviderKeys;
  chainTech: EChainTechnology;
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
      chainTech: EChainTechnology.EVM,
      key: EWalletProviderKeys.METAMASK,
      installationUrl: "https://metamask.io/",
    },
    {
      provider: new PhantomWalletProvider(),
      icon: "https://storage.googleapis.com/dw-assets/spa/icons/phantom.png",
      name: "Phantom",
      key: EWalletProviderKeys.PHANTOM,
      chainTech: EChainTechnology.Solana,
      installationUrl: "https://phantom.app/download",
    },
    {
      provider: new CoinbaseWalletProvider(),
      icon: "https://storage.googleapis.com/dw-assets/spa/icons/coinbase.png",
      name: "Coinbase",
      key: EWalletProviderKeys.COINBASE,
      chainTech: EChainTechnology.EVM,
      installationUrl: "https://www.coinbase.com/wallet",
    },
  ];
};
