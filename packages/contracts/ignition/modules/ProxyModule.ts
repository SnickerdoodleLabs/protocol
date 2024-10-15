import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("ProxyModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);

  const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

  const snickerdoodleWalletFactory = m.contract("SnickerdoodleWalletFactory");

  const proxy = m.contract("TransparentUpgradeableProxy", [
    snickerdoodleWalletFactory,
    proxyAdminOwner,
    "0x",
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin",
  );

  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

export default proxyModule;
