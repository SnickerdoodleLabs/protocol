import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OperatorGatewayModule = buildModule("OperatorGatewayModule", (m) => {
  const owner = m.getAccount(0);

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
