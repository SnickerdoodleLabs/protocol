import { EChain } from "@snickerdoodlelabs/objects";

export const getChainImageSrc = (chain: EChain) => {
  switch (chain) {
    case EChain.EthereumMainnet: {
      return "https://storage.googleapis.com/dw-assets/shared/icons/eth.png";
    }
    case EChain.Solana: {
      return "https://storage.googleapis.com/dw-assets/shared/icons/sol.png";
    }
    default: {
      return "";
    }
  }
};
