import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const npx hardhat ignition visualize = buildModule(
  "SnickerdoodleOperatorGatewayModule",
  (m) => {
    const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

    // Change the params here based on the chain to deploy on
    // TODO: fix the burn address coordinates
    const snickerdoodleOperatorGatewayImpl = m.contract(
      "SnickerdoodleWallet",
      [],
    );
    m.call(snickerdoodleOperatorGatewayImpl, "initialize", [
      [owner],
      "0x000000000000000000000000000000000000dEaD",
    ]);

    const snickerdoodleOperatorGatewayBeacon = m.contract("UpgradeableBeacon", [
      owner,
      snickerdoodleOperatorGatewayImpl,
    ]);

    return { snickerdoodleOperatorGatewayBeacon };
  },
);

export default SnickerdoodleOperatorGatewayModule;
