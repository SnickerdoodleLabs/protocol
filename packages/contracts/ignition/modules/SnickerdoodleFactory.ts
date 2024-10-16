import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import OperatorGatewayModule from "./OperatorGateway";
import SnickerdoodleWalletModule from "./SnickerdoodleWallet";

const SnickerdoodleFactoryModule = buildModule(
  "SnickerdoodleFactoryModule",
  (m) => {
    const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

    const { snickerdoodleWalletBeacon } = m.useModule(
      SnickerdoodleWalletModule,
    );
    const { operatorGatewayBeacon } = m.useModule(OperatorGatewayModule);

    // Change the params here based on the chain to deploy on
    const snickerdoodleFactory = m.contract("SnickerdoodleFactory", []);
    m.call(snickerdoodleFactory, "initialize", [
      "0x6EDCE65403992e310A62460808c4b910D972f10f",
      owner,
      snickerdoodleWalletBeacon,
      operatorGatewayBeacon,
    ]);

    return { snickerdoodleFactory };
  },
);

export default SnickerdoodleFactoryModule;
