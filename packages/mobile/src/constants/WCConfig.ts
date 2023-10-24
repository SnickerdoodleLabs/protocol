import { IProviderMetadata } from "@walletconnect/modal-react-native";

export const providerMetadata: IProviderMetadata = {
  name: "React Native V2 dApp",
  description: "RN dApp by WalletConnect",
  url: "https://walletconnect.com/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "sdmobile://",
  },
};

export const sessionParams = {
  namespaces: {
    eip155: {
      chains: ["eip155:1", "eip155:137"],
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "eth_accounts",
      ],
      events: ["accountsChanged", "chainChanged"],
    },
    "eip155:10": {
      methods: ["personal_sign"],
      events: ["accountsChanged", "chainChanged"],
    },
  },
};
