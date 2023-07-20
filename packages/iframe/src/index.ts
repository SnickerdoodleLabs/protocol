import "reflect-metadata";
import {
  EChain,
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { iframeModule } from "@core-iframe/IFrameModule";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
import {
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";

console.log("Snickerdoodle Core IFrame Loaded");

// Left in as an example and reminder that we can pass stuff via the URL params to the iframe
// const urlParams = new URLSearchParams(window.location.search);
// const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
// const debug = urlParams.get("debug");

const iocContainer = new Container();

// Elaborate syntax to demonstrate that we can use multiple modules
iocContainer.load(...[iframeModule]);

const coreListener = iocContainer.get<ICoreListener>(ICoreListenerType);
const coreProvider = iocContainer.get<ICoreProvider>(ICoreProviderType);
const storageUtils = iocContainer.get<IStorageUtils>(IStorageUtilsType);

coreListener
  .activateModel()
  .andThen(() => {
    // Check if we have a stored signature
    return ResultUtils.combine([
      storageUtils.read<EVMAccountAddress>("storedAccountAddress"),
      storageUtils.read<Signature>("storedSignature"),
      storageUtils.read<EChain>("storedChain"),
      storageUtils.read<LanguageCode>("storedLanguageCode"),
    ]).andThen(([accountAddress, signature, chain, languageCode]) => {
      if (
        accountAddress != null &&
        chain != null &&
        signature != null &&
        languageCode != null
      ) {
        console.log("Unlocking Snickerdoodle Core using stored unlock values");
        // If we have a stored signature, we can automatically unlock the
        return coreProvider.getCore().andThen((core) => {
          return core.account.unlock(
            accountAddress,
            signature,
            languageCode,
            chain,
          );
        });
      }
      // If there's no stored signature, we have to wait for the user to unlock the wallet
      return okAsync(undefined);
    });
  })
  .map(() => {
    console.log("Snickerdoodle Core CoreListener model activated");
  })
  .mapErr((e) => {
    console.error("Error while activating CoreListener!", e);
  });
