import { configs } from "@browser-extension/background/configs";
import { initializeSDKCore } from "@snickerdoodlelabs/synamint-extension-sdk/core";

initializeSDKCore(configs).map(() => {
  console.log("core initialized");
});
