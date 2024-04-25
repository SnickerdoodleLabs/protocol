import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  ECoreProxyType,
  defaultLanguageCode,
  EChain,
  AccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react";
import React, { FC, memo, useEffect } from "react";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useDisconnect,
  useSignMessage,
  useConnect,
} from "wagmi";
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

const projectId = "7b43f10fd3404bb16a3c0947b0ff3436";

const metadata = {
  name: "SnickerDoodle Labs",
  description: "SnickerDoodle Labs",
  url: "https://www.snickerdoodle.com/",
  icons: [""],
};

interface IProps {
  openWarningModal: () => void;
  startLoadingIndicator: () => void;
  endLoadingIndicator: () => void;
  triggerConnect: number;
}

const chains = [mainnet, avalanche, avalancheFuji, arbitrum, optimism, polygon];

const WrapperComponent: FC = memo(({ children }) => {
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
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
});

const WalletConnectLogic: FC<IProps> = ({
  openWarningModal,
  startLoadingIndicator,
  endLoadingIndicator,
  triggerConnect,
}) => {
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts } = useAppContext();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data, signMessage, reset, isError } = useSignMessage();
  const [screenFocused, setScreenFocused] = React.useState(true);

  useEffect(() => {
    window.addEventListener("focus", _setFocused);
    window.addEventListener("blur", _setUnfocused);
  }, []);

  const _setFocused = () => {
    setScreenFocused(true);
  };

  const _setUnfocused = () => {
    setScreenFocused(false);
  };

  useEffect(() => {
    localStorage.clear();
    open({ view: "Connect" });
  }, [triggerConnect]);

  useEffect(() => {
    if (!screenFocused) {
      return;
    }
    if (address) {
      if (
        linkedAccounts.find(
          (linkedAccount) =>
            linkedAccount.sourceAccountAddress === address.toLowerCase(),
        )
      ) {
        disconnect();
        return openWarningModal();
      }

      sdlDataWallet.account
        .getLinkAccountMessage(defaultLanguageCode)
        .map((message) => {
          signMessage({ message });
        })
        .mapErr((e) => {
          console.log("error signing message", e);
        });
    }
  }, [address, screenFocused]);

  useEffect(() => {
    if (address && data) {
      startLoadingIndicator();
      sdlDataWallet.account
        .addAccount(
          address as AccountAddress,
          Signature(data),
          defaultLanguageCode,
          EChain.EthereumMainnet,
        )
        .mapErr((e) => {
          reset();
          disconnect();
          console.log("error adding account", e);
          endLoadingIndicator();
        })
        .map(() => {
          reset();
          disconnect();
        });
    }
  }, [address, data]);

  useEffect(() => {
    if (isError) {
      reset();
      disconnect();
      endLoadingIndicator();
    }
  }, [isError]);

  return null;
};

const WalletConnect: FC<IProps> = (props) => {
  return (
    <WrapperComponent>
      <WalletConnectLogic {...props} />
    </WrapperComponent>
  );
};

export default WalletConnect;
