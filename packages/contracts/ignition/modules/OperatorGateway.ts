import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OperatorGatewayModule = buildModule("OperatorGatewayModule", (m) => {
  const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

  // Change the params here based on the chain to deploy on
  // TODO: fix the burn address coordinates
  const operatorGatewayImpl = m.contract("OperatorGateway", []);
  m.call(operatorGatewayImpl, "initialize", [
    [owner],
    "0x000000000000000000000000000000000000dEaD",
  ]);

  const operatorGatewayBeacon = m.contract("UpgradeableBeacon", [
    operatorGatewayImpl,
    owner,
  ]);

  return { operatorGatewayBeacon };
});

export default OperatorGatewayModule;
