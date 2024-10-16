import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SnickerdoodleOperatorGatewayModule from "./SnickerdoodleOperatorGateway";
import SnickerdoodleWalletModule from "./SnickerdoodleWallet";

const SnickerdoodleFactoryModule = buildModule(
  "SnickerdoodleFactoryModule",
  (m) => {
    const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

    const { snickerdoodleWalletBeacon } = m.useModule(
      SnickerdoodleWalletModule,
    );
    const { snickerdoodleOperatorGatewayBeacon } = m.useModule(
      SnickerdoodleOperatorGatewayModule,
    );

    // Change the params here based on the chain to deploy on
    const SnickerdoodleFactory = m.contract("SnickerdoodleFactory", [
      "0x6EDCE65403992e310A62460808c4b910D972f10f",
      owner,
      snickerdoodleWalletBeacon,
      snickerdoodleOperatorGatewayBeacon,
    ]);

    return { SnickerdoodleFactory };
  },
);

export default SnickerdoodleFactoryModule;
