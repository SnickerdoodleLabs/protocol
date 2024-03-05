import { ExternalProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export {};
