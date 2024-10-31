import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EndpointV2MockModule = buildModule("EndpointV2MockModule", (m) => {
  const endpointV2Mock = m.contract("EndpointV2Mock", []);

  return { endpointV2Mock };
});

export default EndpointV2MockModule;
