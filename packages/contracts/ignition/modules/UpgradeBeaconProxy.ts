import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UpgradeBeaconModule = buildModule("UpgradeBeaconModule", (m) => {
  // Retrieve accounts
  const deployer = m.getAccount(0);

  // Address of the existing UpgradeableBeacon contract
  const upgradeableBeaconAddress = "0x23A4B654c87Ac2fF35d27D6A3529E5937Bb9e616"; // Replace with the actual address

  //   // Deploy the new implementation contract
  //   const newImplementation = m.contract("OperatorGateway", [], {
  //     id: "OperatorGatewayV3",
  //   });
  //   m.call(newImplementation, "initialize", [
  //     [deployer],
  //     "0x000000000000000000000000000000000000dEaD",
  //   ]);

  // Attach to the existing UpgradeableBeacon contract using the beacon address
  const upgradeableBeacon = m.contractAt(
    "UpgradeableBeacon",
    upgradeableBeaconAddress,
  );

  // Perform the upgrade by setting the new implementation address
  m.call(upgradeableBeacon, "upgradeTo", [
    "0x8B5bE17F9a1c8b21fd75A48ACceda1Bb71847C7D",
  ]);

  // Return relevant deployed contracts for further usage
  return { upgradeableBeacon };
});

export default UpgradeBeaconModule;
