import { WalletProvider } from "@suiet/wallet-kit";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React, { ReactNode, FC } from "react";
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

// 1. Get projectId
const projectId = "7b43f10fd3404bb16a3c0947b0ff3436";

// 2. Create wagmiConfig
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
    wagmiConfig,
    projectId,
    chains,
    featuredWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
      "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    ],
  });
  return (
    <WalletProvider autoConnect={false}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </WalletProvider>
  );
};

export default WalletKits;
