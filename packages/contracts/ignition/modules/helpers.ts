export const getLzEndpointByChainId = (chainId: number): string => {
  switch (chainId) {
    case 31337: // hardhat: TODO: create a mock
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 43113: // fuji
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 11155111: // sepolia (sepolia and fuji have the same address)
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 84532: // base sepolia (base sepolia and fuji have the same address)
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 43114: // Avalanche
      return "0x1a44076050125825900e736c501f859c50fE728c";
    case 8453: // Base
      return "0x1a44076050125825900e736c501f859c50fE728c";
    case 1: // Ethereum
      return "0x1a44076050125825900e736c501f859c50fE728c";
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export const getChainIdByChainName = (chainName: string): number => {
  switch (chainName) {
    case "hardhat": // hardhat: TODO: create a mock
      return 31337;
    case "fuji": // fuji
      return 43113;
    case "sepolia": // sepolia (sepolia and fuji have the same address)
      return 11155111;
    case "avalanche": // Avalanche
      return 43114;
    case "base": // Base
      return 8453;
    case "basesepolia": // Base Sepolia
      return 84532;
    case "mainnet": // Ethereum
      return 1;
    default:
      throw new Error(`Unsupported chain name: ${chainName}`);
  }
};
