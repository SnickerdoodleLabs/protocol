import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SnickerdoodleWalletModule = buildModule(
  "SnickerdoodleWalletModule",
  (m) => {
    const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

    // Change the params here based on the chain to deploy on
    // TODO: fix the burn address coordinates
    const snickerdoodleWalletImpl = m.contract("SnickerdoodleWallet", []);
    m.call(snickerdoodleWalletImpl, "initialize", [
      owner,
      [
        "1337",
        "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5",
        "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f",
      ],
    ]);

    const snickerdoodleWalletBeacon = m.contract("UpgradeableBeacon", [
      owner,
      snickerdoodleWalletImpl,
    ]);

    return { snickerdoodleWalletBeacon };
  },
);

export default SnickerdoodleWalletModule;
