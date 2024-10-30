import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat"; // Import hre directly

import { getChainIdByChainName, getLzEndpointByChainId } from "./helpers";
import OperatorGatewayModule from "./OperatorGateway";
import SnickerdoodleWalletModule from "./SnickerdoodleWallet";
import EndpointV2MockModule from "./mock/EndpointV2Mock";

const SnickerdoodleFactoryModule = buildModule(
  "SnickerdoodleFactoryModule",
  (m) => {
    // Get the owner account
    const proxyAdminOwner = m.getAccount(0);

    let layerZeroEndpointAddress = null;

    if (hre.network.name === "hardhat") {
      // This makes the module flexible for local testing
      // If it's a localhost testing, deploy a mock EndpointV2Mock so that we can initialize the SnickerdoodleFactory with a endpointv2 contract that exists
      // It reverts otherwise
      layerZeroEndpointAddress =
        m.useModule(EndpointV2MockModule).endpointV2Mock;
    }

    // Use dependent modules to get beacon addresses
    const { snickerdoodleWalletBeacon } = m.useModule(
      SnickerdoodleWalletModule,
    );

    const { operatorGatewayBeacon } = m.useModule(OperatorGatewayModule);

    // Deploy the SnickerdoodleFactory contract implementation
    const snickerdoodleFactory = m.contract("SnickerdoodleFactory", []);

    // Deploy the TransparentUpgradeableProxy contract
    const proxy = m.contract("TransparentUpgradeableProxy", [
      snickerdoodleFactory, // Address of the logic/implementation contract
      proxyAdminOwner, // Proxy admin
      "0x", // Empty initializer data
    ]);

    // Read the ProxyAdmin address from the event
    const proxyAdminAddress = m.readEventArgument(
      proxy,
      "AdminChanged",
      "newAdmin",
    );

    // Get the ProxyAdmin contract instance
    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

    // Interact with the proxy using the SnickerdoodleFactory ABI
    const snickerdoodleFactoryProxy = m.contractAt(
      "SnickerdoodleFactory",
      proxy,
      { id: "SnickerdoodleFactoryProxy" },
    );

    // Initialize the implementation contract through the proxy
    m.call(snickerdoodleFactoryProxy, "initialize", [
      // For local testing if there's an endpoint mock, use its address, otherwise use the official chain's endpoint addresses
      layerZeroEndpointAddress
        ? layerZeroEndpointAddress
        : getLzEndpointByChainId(getChainIdByChainName(hre.network.name)), // Layer Zero endpoint
      proxyAdminOwner, // Proxy admin owner
      snickerdoodleWalletBeacon, // Wallet beacon
      operatorGatewayBeacon, // Operator gateway beacon
    ]);

    // Return deployed contracts for reference
    return { snickerdoodleFactory, proxyAdmin, proxy };
  },
);

export default SnickerdoodleFactoryModule;
