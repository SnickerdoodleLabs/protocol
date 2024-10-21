import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SnickerdoodleWalletModule = buildModule(
  "SnickerdoodleWalletModule",
  (m) => {
    const owner = m.getAccount(0);

    // Change the params here based on the chain to deploy on
    // TODO: fix the burn address coordinates
    const snickerdoodleWalletImpl = m.contract("SnickerdoodleWallet", []);
    m.call(snickerdoodleWalletImpl, "initialize", [
      owner,
      [
        {
          keyId: "1337",
          x: "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5",
          y: "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f",
        },
      ],
      [owner],
    ]);

    const snickerdoodleWalletBeacon = m.contract("UpgradeableBeacon", [
      snickerdoodleWalletImpl,
      owner,
    ]);

    return { snickerdoodleWalletBeacon };
  },
);

export default SnickerdoodleWalletModule;
