export const getLzEndpointByChainId = (chainId: number): string => {
  switch (chainId) {
    case 31337: // hardhat: TODO: create a mock
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 43114: // fuji
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 11155111: // sepolia (sepolia and fuji have the same address)
      return "0x6EDCE65403992e310A62460808c4b910D972f10f";
    case 43113: // Avalanche
      return "0x1a44076050125825900e736c501f859c50fE728c";
    case 8453: // Base
      return "0x1a44076050125825900e736c501f859c50fE728c";
    case 1: // Ethereum
      return "0x1a44076050125825900e736c501f859c50fE728c";
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};
