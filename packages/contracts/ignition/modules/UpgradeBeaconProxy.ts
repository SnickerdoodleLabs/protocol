import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UpgradeBeaconModule = buildModule("UpgradeBeaconModule", (m) => {
  // Retrieve accounts
  const deployer = m.getAccount(0);

  // Address of the existing UpgradeableBeacon contract
  const upgradeableBeaconAddress = "0x9A4f55bd9B7DB612765d1Ef8aEA27433985f87D9"; // Replace with the actual address

  // Deploy the new implementation contract
  const newImplementation = m.contract("OperatorGateway", [], {
    id: "OperatorGatewayV2",
  });
  m.call(newImplementation, "initialize", [
    [deployer],
    "0x000000000000000000000000000000000000dEaD",
  ]);

  // Attach to the existing UpgradeableBeacon contract using the beacon address
  const upgradeableBeacon = m.contractAt(
    "UpgradeableBeacon",
    upgradeableBeaconAddress,
  );

  // Perform the upgrade by setting the new implementation address
  m.call(upgradeableBeacon, "upgradeTo", [newImplementation]);

  // Return relevant deployed contracts for further usage
  return { upgradeableBeacon };
});

export default UpgradeBeaconModule;
