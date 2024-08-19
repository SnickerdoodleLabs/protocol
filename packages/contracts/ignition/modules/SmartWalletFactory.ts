import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
//import {ChainKey, EndpointVersion, networkToEndpointId} from '@layerzerolabs/lz-definitions';

const SmartWalletModule = buildModule("SmartWalletModule", (m) => {
  const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

  // Change the params here based on the chain to deploy on
  // List of Endpoint addresses can be found here: https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
  // Approach from doc using lz-definitions above doesnt work yet

  const smartWalletFactory = m.contract("SmartWalletFactory", [
    "0x6EDCE65403992e310A62460808c4b910D972f10f",
    owner,
  ], {
    value: 
  });

  return { smartWalletFactory };
});

export default SmartWalletModule;
