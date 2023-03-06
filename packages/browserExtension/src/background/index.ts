import { extensionCore } from "@snickerdoodlelabs/synamint-extension-sdk/core";

extensionCore.initialize().map(() => {
  console.log("core initialized");
});
