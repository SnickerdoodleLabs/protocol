import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import { WalletProvider } from "@suiet/wallet-kit";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React, { ReactNode, FC, memo } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  avalanche,
  avalancheFuji,
  arbitrum,
  optimism,
  polygon,
} from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import "@suiet/wallet-kit/style.css";

const projectId = "7b43f10fd3404bb16a3c0947b0ff3436";

const metadata = {
  name: "SnickerDoodle Labs",
  description: "SnickerDoodle Labs",
  url: "https://www.snickerdoodle.com/",
  icons: [""],
};

interface IProps {
  children: NonNullable<ReactNode>;
}

const chains = [mainnet, avalanche, avalancheFuji, arbitrum, optimism, polygon];

const WalletKits: FC<IProps> = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const { publicClient } = configureChains(chains, [
    walletConnectProvider({ projectId }),
    publicProvider(),
  ]);
  const wagmiConfig = createConfig({
    autoConnect: false,
    connectors: [
      new WalletConnectConnector({
        chains,
        options: { projectId, showQrModal: false, metadata },
      }),
      new EIP6963Connector({ chains }),
      new InjectedConnector({ chains, options: { shimDisconnect: false } }),
      new CoinbaseWalletConnector({
        chains,
        options: { appName: metadata.name },
      }),
    ],
    publicClient,
  });
  createWeb3Modal({
    themeVariables: {
      "--w3m-z-index": 2001,
    },
    wagmiConfig,
    projectId,
    chains,
    featuredWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
      "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    ],
    excludeWalletIds: [
      ...(sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE
        ? ["a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393"]
        : []),
    ],
  });
  return (
    <WalletProvider autoConnect={false}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </WalletProvider>
  );
};

export default memo(WalletKits);
